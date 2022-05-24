const oldPrototype = Array.prototype;
const newArrPrototype = Object.create(oldPrototype);
['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'].forEach(i => {
    newArrPrototype[i] = function() {
        console.log(`劫持了${i}方法`);
        console.log(arguments);
        for(let i = 0; i < arguments.length; i++) {
            observer(arguments[i])
        }
        // 执行原数组中的原始方法
        return oldPrototype[i].apply(this, arguments);
    }
})

// 响应式对象数据
function observer(obj) {
    if(typeof obj !== 'object' || obj === null) return;
    let keys = Object.keys(obj);
    for(let i = 0; i < keys.length; i++) {
        // 判断是否是数组，响应化数组的每一项
        // 但是存在问题：只能响应式数组的get和set,不能响应式数组的方法
        // 解决办法重写数组的方法
        let item = obj[keys[i]];
        if(Array.isArray(item)) {
            item.__proto__ = newArrPrototype;
            for(let j = 0; j < item.length; j++) {
                observer(item[j])
            }
        } else {
            defineReactive(obj, keys[i], item)
        }
    }
}

// 劫持target的属性key的set和get
function defineReactive(target, key, value) {
    console.log(`对${key}属性响应式`);
    let dep = new Dep();
    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        get() {
            // 依赖收集
			dep.depend();
            console.log('get 啦', value);
            return value;
        },
        set(val) {
            if(value === val) return;
            console.log('set 啦', value, val);
            value = val;
            // 派发更新，找到全局的watcher， 调用update
			dep.notify();
        }
    })
}

/** 将某一个对象的属性访问 映射到对象的某一个属性成员上 **/
function proxy(target, prop, key) {
	Object.defineProperty(target, key, {
		enumerable: true,
		configurable: true,
		get() {
			return target[prop][key]
		},
		set(newVal) {
			target[prop][key] = newVal
		},
	})
}


SimpleVue.prototype.initData = function() {
    observer(this._data);

    /**
     * 让data里面的属性通过this.能够访问到
     */
    let keys = Object.keys(this._data)
    for(let i = 0; i < keys.length; i++) {
        proxy(this, '_data', keys[i])
    }
}