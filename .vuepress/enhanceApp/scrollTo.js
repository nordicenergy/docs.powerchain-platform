export default (context) => {
    const { isServer } = context
    if(!isServer) {
        const originalScrollTo = window.scrollTo;
        window.scrollTo = function(options, callback) {
            if(!Object.prototype.toString.call(options).includes('Object')) {
                options = {
                    top: options,
                }
            }
            const onScroll = () => {

                const optionsTop = options.top;
                const scrollHeight = document.documentElement.scrollHeight;
                const scrollHeightArea = scrollHeight - window.innerHeight;
                if (
                    window.pageYOffset === optionsTop ||
                    (optionsTop >= scrollHeightArea) && window.pageYOffset >= scrollHeightArea
                ) {
                    window.removeEventListener('scroll', onScroll)
                    callback && callback();
                }
            }
            window.addEventListener('scroll', onScroll)
            onScroll();
            originalScrollTo(options);
        };
    }
};
