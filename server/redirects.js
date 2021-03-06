const path = require('path');
const url = require('url');
const checkedExtensionsForRedirect = ['.html', '.md'];
const checkedUrlEndForRedirect = ['', ...checkedExtensionsForRedirect];
const removeExtensionPartFromUrl = (url) => {
    const urlPathParsed = path.parse(url);
    const urlPathParsedName = urlPathParsed.name;
    let computedUrl = `${urlPathParsed.dir}${urlPathParsedName ? '/' + urlPathParsedName : ''}${
        checkedExtensionsForRedirect.every(extensionForRedirect =>  extensionForRedirect !== urlPathParsed.ext) ? urlPathParsed.ext : ''
    }`;
    if(computedUrl.slice(0, 2) === '//') {
        computedUrl = computedUrl.slice(1);
    }
    return computedUrl;
};

module.exports = (redirectList = []) => {
    return async(ctx, next) => {
        const requestOriginalUrl = ctx.originalUrl;
        const originalUrlParsed = url.parse(requestOriginalUrl);
        const urlPathParsed = path.parse(requestOriginalUrl);

        if(!redirectList.length) {
            await next();
            return;
        }
        const isUrlPathExtensionNeedRedirect = checkedUrlEndForRedirect.some(extension => {
            return extension === urlPathParsed.ext;
        });
        if(!isUrlPathExtensionNeedRedirect) {
            await next();
            return;
        }
        for (const redirectRule of redirectList) {


            const redirectRuleFrom = redirectRule.from;
            const redirectRuleTo = redirectRule.to;
            const isTestMatch = new RegExp(redirectRuleFrom).test(originalUrlParsed.path);
            if(!isTestMatch) {
                continue
            }
            const isExternalLinkTo = redirectRuleTo.slice(0, 4) === 'http';
            if (
              redirectRuleTo &&
              redirectRuleFrom === requestOriginalUrl
            ) {
                ctx.redirect(
                  removeExtensionPartFromUrl(
                    isExternalLinkTo ? redirectRuleTo : `${ctx.protocol}://${ctx.headers.host + redirectRuleTo}`
                  )
                );
                return;
            }

            let regexpResult = '';
            if(
              redirectRuleFrom &&
              redirectRuleTo &&
              (redirectRuleTo.includes('$') || redirectRuleFrom.includes('('))
            ) {
                let originalUrl = requestOriginalUrl;
                if(isExternalLinkTo) {
                    originalUrl = redirectRuleTo;
                }
                regexpResult = originalUrl.replace(new RegExp(redirectRuleFrom), redirectRuleTo);
            }

            if(regexpResult && requestOriginalUrl !== regexpResult) {

                if(redirectRuleTo.includes('$')) {
                    ctx.redirect(
                      removeExtensionPartFromUrl(
                        isExternalLinkTo ? regexpResult : `${ctx.protocol}://${ctx.headers.host + regexpResult}`
                      )
                    );
                    return;
                }

                ctx.redirect(
                  removeExtensionPartFromUrl(redirectRuleTo)
                );
                return;
            }
        }
        if(checkedExtensionsForRedirect.some(extension => {
            return extension === urlPathParsed.ext;
        })) {
            ctx.redirect(
              removeExtensionPartFromUrl(requestOriginalUrl)
            );
            return;
        }
        await next();
    };
};
