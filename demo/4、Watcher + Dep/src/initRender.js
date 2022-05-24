SimpleVue.prototype.mount = function() {
    this.render = this.createRenderFn()
    this.mountComponent()
}

SimpleVue.prototype.mountComponent = function() {
    let mountFn = () => {
        console.log('mountFn');
        this.update(this.render())
    }

    new Watcher(this, mountFn)
}

SimpleVue.prototype.createRenderFn = function() {
    let ast = getVnode(this._template);
    return function render() {
        console.log(ast);
        console.log(this._data);
        
        return combine(ast, this._data)
    }
}

SimpleVue.prototype.update = function(node) {
    console.log(node);
    
    // 替换解析好的ast到真实DOM上
    const parseDom = parseVnode(node)
    const dom = document.querySelector(this._el);
    dom.parentNode.replaceChild(parseDom, dom)
}