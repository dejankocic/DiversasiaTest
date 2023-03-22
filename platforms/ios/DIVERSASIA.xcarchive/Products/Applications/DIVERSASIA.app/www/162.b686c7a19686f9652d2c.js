(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[162],{

/***/ "TpdJ":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ion_tab", function() { return Tab; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ion_tabs", function() { return Tabs; });
/* harmony import */ var _index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("wEJo");
/* harmony import */ var _framework_delegate_4392cd63_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("acej");
/* harmony import */ var _helpers_dd7e4b7b_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("1vRN");




const tabCss = ":host(.tab-hidden){display:none !important}";

const Tab = class {
  constructor(hostRef) {
    Object(_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "o"])(this, hostRef);
    this.loaded = false;
    /** @internal */
    this.active = false;
  }
  async componentWillLoad() {
    if (this.active) {
      await this.setActive();
    }
  }
  /** Set the active component for the tab */
  async setActive() {
    await this.prepareLazyLoaded();
    this.active = true;
  }
  changeActive(isActive) {
    if (isActive) {
      this.prepareLazyLoaded();
    }
  }
  prepareLazyLoaded() {
    if (!this.loaded && this.component != null) {
      this.loaded = true;
      try {
        return Object(_framework_delegate_4392cd63_js__WEBPACK_IMPORTED_MODULE_1__["a"])(this.delegate, this.el, this.component, ['ion-page']);
      }
      catch (e) {
        console.error(e);
      }
    }
    return Promise.resolve(undefined);
  }
  render() {
    const { tab, active, component } = this;
    return (Object(_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "j"])(_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__[/* H */ "c"], { role: "tabpanel", "aria-hidden": !active ? 'true' : null, "aria-labelledby": `tab-button-${tab}`, class: {
        'ion-page': component === undefined,
        'tab-hidden': !active
      } }, Object(_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "j"])("slot", null)));
  }
  get el() { return Object(_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__[/* i */ "k"])(this); }
  static get watchers() { return {
    "active": ["changeActive"]
  }; }
};
Tab.style = tabCss;

const tabsCss = ":host{left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;-ms-flex-direction:column;flex-direction:column;width:100%;height:100%;contain:layout size style;z-index:0}.tabs-inner{position:relative;-ms-flex:1;flex:1;contain:layout size style}";

const Tabs = class {
  constructor(hostRef) {
    Object(_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "o"])(this, hostRef);
    this.ionNavWillLoad = Object(_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__[/* e */ "g"])(this, "ionNavWillLoad", 7);
    this.ionTabsWillChange = Object(_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__[/* e */ "g"])(this, "ionTabsWillChange", 3);
    this.ionTabsDidChange = Object(_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__[/* e */ "g"])(this, "ionTabsDidChange", 3);
    this.transitioning = false;
    /** @internal */
    this.useRouter = false;
    this.onTabClicked = (ev) => {
      const { href, tab } = ev.detail;
      if (this.useRouter && href !== undefined) {
        const router = document.querySelector('ion-router');
        if (router) {
          router.push(href);
        }
      }
      else {
        this.select(tab);
      }
    };
  }
  async componentWillLoad() {
    if (!this.useRouter) {
      this.useRouter = !!document.querySelector('ion-router') && !this.el.closest('[no-router]');
    }
    if (!this.useRouter) {
      const tabs = this.tabs;
      if (tabs.length > 0) {
        await this.select(tabs[0]);
      }
    }
    this.ionNavWillLoad.emit();
  }
  componentWillRender() {
    const tabBar = this.el.querySelector('ion-tab-bar');
    if (tabBar) {
      const tab = this.selectedTab ? this.selectedTab.tab : undefined;
      tabBar.selectedTab = tab;
    }
  }
  /**
   * Select a tab by the value of its `tab` property or an element reference.
   *
   * @param tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property.
   */
  async select(tab) {
    const selectedTab = getTab(this.tabs, tab);
    if (!this.shouldSwitch(selectedTab)) {
      return false;
    }
    await this.setActive(selectedTab);
    await this.notifyRouter();
    this.tabSwitch();
    return true;
  }
  /**
   * Get a specific tab by the value of its `tab` property or an element reference.
   *
   * @param tab The tab instance to select. If passed a string, it should be the value of the tab's `tab` property.
   */
  async getTab(tab) {
    return getTab(this.tabs, tab);
  }
  /**
   * Get the currently selected tab.
   */
  getSelected() {
    return Promise.resolve(this.selectedTab ? this.selectedTab.tab : undefined);
  }
  /** @internal */
  async setRouteId(id) {
    const selectedTab = getTab(this.tabs, id);
    if (!this.shouldSwitch(selectedTab)) {
      return { changed: false, element: this.selectedTab };
    }
    await this.setActive(selectedTab);
    return {
      changed: true,
      element: this.selectedTab,
      markVisible: () => this.tabSwitch(),
    };
  }
  /** @internal */
  async getRouteId() {
    const tabId = this.selectedTab && this.selectedTab.tab;
    return tabId !== undefined ? { id: tabId, element: this.selectedTab } : undefined;
  }
  setActive(selectedTab) {
    if (this.transitioning) {
      return Promise.reject('transitioning already happening');
    }
    this.transitioning = true;
    this.leavingTab = this.selectedTab;
    this.selectedTab = selectedTab;
    this.ionTabsWillChange.emit({ tab: selectedTab.tab });
    selectedTab.active = true;
    return Promise.resolve();
  }
  tabSwitch() {
    const selectedTab = this.selectedTab;
    const leavingTab = this.leavingTab;
    this.leavingTab = undefined;
    this.transitioning = false;
    if (!selectedTab) {
      return;
    }
    if (leavingTab !== selectedTab) {
      if (leavingTab) {
        leavingTab.active = false;
      }
      this.ionTabsDidChange.emit({ tab: selectedTab.tab });
    }
  }
  notifyRouter() {
    if (this.useRouter) {
      const router = document.querySelector('ion-router');
      if (router) {
        return router.navChanged('forward');
      }
    }
    return Promise.resolve(false);
  }
  shouldSwitch(selectedTab) {
    const leavingTab = this.selectedTab;
    return selectedTab !== undefined && selectedTab !== leavingTab && !this.transitioning;
  }
  get tabs() {
    return Array.from(this.el.querySelectorAll('ion-tab'));
  }
  render() {
    return (Object(_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "j"])(_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__[/* H */ "c"], { onIonTabButtonClick: this.onTabClicked }, Object(_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "j"])("slot", { name: "top" }), Object(_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "j"])("div", { class: "tabs-inner" }, Object(_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "j"])("slot", null)), Object(_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "j"])("slot", { name: "bottom" })));
  }
  get el() { return Object(_index_7a8b7a1c_js__WEBPACK_IMPORTED_MODULE_0__[/* i */ "k"])(this); }
};
const getTab = (tabs, tab) => {
  const tabEl = (typeof tab === 'string')
    ? tabs.find(t => t.tab === tab)
    : tab;
  if (!tabEl) {
    console.error(`tab with id: "${tabEl}" does not exist`);
  }
  return tabEl;
};
Tabs.style = tabsCss;




/***/ })

}]);