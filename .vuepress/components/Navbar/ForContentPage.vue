<template>
    <header :class="$style.root">
        <slot name="rootBackground"/>
        <WidthLimit
            :class="$style.root__wrapper"
            :type="2"
            :style="{
                paddingLeft: isOpenLeftSidebar ? leftSidebarWidth + 'px' : '',
            }"
        >
            <div
                :class="$style.searchBoxWrapper2"
                :style="{
                    paddingLeft: isOpenLeftSidebar ? leftSidebarWidth + 'px' : '',
                    justifyContent: layoutWidth > 719 ? 'space-between' : 'flex-end',
                }"
            >
                <WidthLimit
                    v-show="layoutWidth > 719"
                    :class="$overallStyle.searchBoxWrapper"
                    :type="1"
                    :padding-l-r="3"
                >
                    <SearchBox
                        :class="$overallStyle.searchBox"
                        :is-full-size="true"
                        :size="1"
                        :with-suggestions="false"
                        @up="layoutWidth > 719 && suggestionsUp"
                        @down="layoutWidth > 719 && suggestionsDown"
                        @search="search"
                    />
                    <WidthLimit
                        v-show="!isShowSearchResultWindow"
                        :class="$overallStyle.searchSuggestionsWrapper"
                        :type="1"
                        :padding-l-r="3"
                    >
                        <Suggestions
                            ref="suggestions"
                            :class="$overallStyle.searchSuggestions"
                        />
                    </WidthLimit>
                </WidthLimit>
                <SwitchLanguage :class="$style.switchLanguage"/>
            </div>
            <Sidebar
                v-show="isShowSidebar && layoutWidth > 719"
                ref="sidebar2"
                side="right"
                :sidebar-toggle-trigger-options="{
                    isShow: true,
                }"
                :items="[$page]"
                :mod="2"
                :sidebar-min-width-px="rightSidebarMinWidthPx"
                :class="$style.sidebar"
                :style="{
                    height: `calc(100vh - ${headerHeight}px)`,
                }"
                @isResizingState="isRightSidebarResizingState = $event"
            />

            <div
                :class="$style.root__cell1"
            >
                <WidthLimit
                    v-show="layoutWidth < 720"
                    :class="$style.logotypeWrapper"
                    :type="1"
                    :style="{
                        justifyContent: logotypeJustifyContent,
                    }"
                >
                    <router-link :to="$localePath">
                        <Logotype
                            :class="$style.logotype"/>
                    </router-link>


                </WidthLimit>
            </div>
        </WidthLimit>
    </header>
</template>

<script>
  import BurgerTrigger from '@theme/components/BurgerTrigger'
  import overallMixin from './overallMixin'
  import Sidebar from '@theme/components/Sidebar/'

  export default {
      props: {
        isShowSidebar: {
            type: Boolean,
            default: true,
        },
        logotypeJustifyContent: {
            type: String,
            default: 'center',
        },
      },
    mixins: [
      overallMixin,
    ],
    components: {
      BurgerTrigger,
      Sidebar,
    },
    computed: {
      mainContentPositionLeft() {
        return this.$store.state.interface.mainContentPositionLeft;
      },
      headerHeight () {
        return this.$store.state.interface.headerHeight;
      },
      rightSidebarMinWidthPx () {
        return this.$store.state.interface.rightSidebarMinWidthPx;
      },
      isOpenLeftSidebar() {
        return this.$store.state.interface.isOpenLeftSidebar;
      },
      isOpenRightSidebar() {
        return this.$store.state.interface.isOpenRightSidebar;
      },
      leftSidebarWidth () {
        return this.$store.state.interface.leftSidebarWidth
      },
      rightSidebarWidth () {
        return this.$store.state.interface.rightSidebarWidth
      }
    }
  }
</script>

<style lang="stylus" module>
    @import '~@themeExtend/components/Navbar/ForContentPage';

    .root {

    }
    .sidebar {
        position absolute
        right 0
        top 100%
        z-index 1
    }
    .root__wrapper {
        display flex
        justify-content flex-end
        padding-right 0
        padding-left 0
        margin-right 0
        transition padding-right $transitionS1, margin-right $transitionS1
        position relative
        align-items center
    }
    .root__cell1 {
        width 100%
        display flex
        justify-content center
        align-items center

    }

    .burgerTriggerWrapper,
    .switchLanguageWrapper {
        position absolute
        top 0
        left 0
        height 100%
        width 100%
        display flex
        align-items center
        justify-content flex-start
    }


    .burgerTriggerWrapper {

    }

    .burgerTrigger {
        cursor pointer
    }

    .searchBoxWrapper2 {
        position absolute
        width 100%
        height 100%
        display flex
        align-items center
        /*justify-content center*/
        justify-content space-between
        z-index 2
        visibility hidden
        /*transition padding-left $transitionS1*/
    }

    .searchBoxWrapper {
        /*height 40px*/
        height 100%
        position relative
        display flex
        align-items center
    }
    .searchBox {
        visibility visible
        height 40px
    }
    .searchSuggestionsWrapper {
        position absolute
        top 100%
        left 0
        width 100%
        margin-top 1px
    }
    .searchSuggestions {
        margin 0
    }
    .logotypeWrapper {
        display flex
        position absolute
        height 100%
        visibility hidden
        align-items center
    }

    .logotype {
        width 100%
        visibility visible
    }

    .switchLanguageWrapper {
        visibility hidden
        z-index 2
        justify-content flex-end
    }
    .switchLanguage {
        visibility visible
        margin-right $indent3
    }

</style>

