
let depUuid = 0;
class Dep{
    constructor() {
        this.id = depUuid++
        this.subs = [];
    }

    // 新增一个依赖watcher
    addSub(sub) {
        this.subs.push(sub)
    }

    // 删除sub
    removeSub(sub) {
        for(let i = this.subs.length - 1; i >= 0; i --) {
            if(sub === this.subs[i]) {
                this.subs.splice(i, 1);
            }
        }
    }

    depend() {
        // 将当前的Dep和Watcher相关联
        if(Dep.target) {
            this.addSub(Dep.target)
            Dep.target.addSub(this)
        }
    }

    // 触发watcher的更新
    notify() {
        const subs = this.subs.slice()
		// 将watcher list做下排序，为了执行的时候和创建的时候顺序一致
		// 可以确保执行的正确性
		subs.sort((a, b) => a.id - b.id)
		// 然后挨个执行dep所关联的watcher的update
		for (let i = 0, l = subs.length; i < l; i++) {
			subs[i].update()
		}
    }
}

Dep.target = null

// 活动的watcher 执行栈
const targetStack = []
function pushTarget(target) {
	targetStack.push(target)
	Dep.target = target
}

function popTarget() {
	targetStack.pop()
	Dep.target = targetStack[targetStack.length - 1]
}
