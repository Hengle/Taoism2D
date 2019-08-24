jse = (function () {
    // Enhanced typeof, add "array" as a type
    const typeOf = x => {
      return Array.isArray(x) ? "array" : (typeof x);
    };

    // Compare two value, when they are both objects, recursively compare their enumerable properties.
    // The third parameter indicates if their prototype chains are considered, which is defalt to false.

    // (a: angy, b: any, consider_proto = false: boolean) => boolean 
    const deepEquel = (a, b, consider_proto = false) => {
        if (a === b) { return true; }
        if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) { return false; }

        const keysOfA = Object.keys(a);
        const keysOfB = Object.keys(b);
        if (keysOfA.length !== keysOfB.length) { return false; }
        for (let key of keysOfA) {
            if (b[key] === undefined || !deepEquel(a[key], b[key], consider_proto)) { return false; }
        }
        if (!consider_proto) {
            return true;
        } else {
            return deepEquel(Object.getPrototypeOf(a), Object.getPrototypeOf(b), consider_proto);
        }
    };

    const pipe = (...funcs) => x => funcs.reduce((acc, f) => f(acc), x);
    const pipeAsync = (...funcs) => x => funcs.reduce((acc, f) => acc.then(f), x);
    const curry = (
        f, arr = []
    ) => (...args) => (
        a => a.length === f.length ?
            f(...a) :
            curry(f, a)
    )([...arr, ...args]);

    return {
        typeOf,
        deepEquel,
        pipe,
        pipeAsync,
        curry,

    };
});
