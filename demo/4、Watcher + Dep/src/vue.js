function SimpleVue(options) {
    this._data = options.data;
    this._el = options.el;
    this._template = document.querySelector(options.el);

    this.initData();
    this.mount();
}