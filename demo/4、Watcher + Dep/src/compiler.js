function attributesToObj(attrs) {
    let obj = {};
    for(let i = 0; i < attrs.length; i++) {
        obj[attrs[i].name] = attrs[i].nodeValue
    }
    return obj;
}

// DOM 转 Vnode
function getVnode(ele) {
    let _vnode;
    if(ele.nodeType === 1) {
        let attrs = attributesToObj(ele.attributes);
        _vnode = new VNode(ele.nodeName, attrs, ele.nodeValue, ele.nodeType)
        let children = ele.childNodes;
        for(let i = 0; i < children.length; i++) {
            _vnode.appendChild(getVnode(children[i]))
        }
    } else if(ele.nodeType === 3) {
        _vnode = new VNode(undefined, undefined, ele.nodeValue, ele.nodeType);
    }

    return _vnode;
}

// Vnode 解析成 真实DOM
function parseVnode(node) {
    let dom;
    if(node.type === 1) {
        dom = document.createElement(node.tag)
        for(let key in node.data) {
            dom.setAttribute(key, node.data[key])
        }

        for(let i = 0; i < node.children.length; i++) {
            dom.appendChild(parseVnode(node.children[i]))
        }
    } else if(node.type === 3) {
        dom = document.createTextNode(node.value)
    }
    return dom
}

const regExp = /\{\{(.+?)\}\}/g

function combine(ast, data) {
	let _type = ast.type
	let _data = ast.data
	let _value = ast.value
	let _tag = ast.tag
	let _children = ast.children
	let _vnode = null

    if(_type === 3) {
        // 替换{{}}中的内容
        _value = _value.replace(regExp, function(_, newValue) {
            const dataKey = newValue.trim();
            const value = getKeyValue(data, dataKey);
            return value
        })
        _vnode = new VNode(_tag, _data, _value, _type)
    } else if(_type === 1) {
        // 元素节点
		_vnode = new VNode(_tag, _data, _value, _type)
		_children.forEach((_subvnode) =>
			_vnode.appendChild(combine(_subvnode, data))
		)
    }
    return _vnode
}

    // 处理 data链式操作 x.x
function getKeyValue(data, keyStr) {
    let keyStrArr = keyStr.split('.');
    while(keyStrArr.length > 0) {
        const key = keyStrArr.shift();
        data = data[key]
    }
    return data;
}