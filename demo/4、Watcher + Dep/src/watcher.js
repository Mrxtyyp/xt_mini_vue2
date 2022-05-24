let watchUuid = 0;

class Watcher{
    constructor(vm, expOrFn) {
        this.vm = vm;
        this.id = watchUuid++;
        this.getter =  expOrFn;

        this.deps = [];
        this.depIds = [];

        this.get()
    }

    get() {
        pushTarget(this)
        this.getter.call(this.vm, this.vm)
        popTarget()
    }

    run() {
        this.get()
    }

    // 只考虑同步更新，异步队列采用queueWatcher
    update() {
        this.run()
    }

    cleanupDeps() {
        
    }

    addSub(dep) {
        this.deps.push(dep)
    }
}