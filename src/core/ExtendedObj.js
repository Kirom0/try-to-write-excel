class ExtendedObj {
  constructor(obj) {
    const forEach = function(cb) {
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          cb(key, obj[key]);
        }
      }
    };
    const map = function(cb) {
      const ans = {};
      forEach((k, v) => {
        const cbReturn = cb(k, v);
        if (cbReturn instanceof Array) {
          const [nk, nv] = cbReturn;
          ans[nk] = nv;
        } else {
          (new ExtendedObj(cbReturn)).forEach((k, v) => {
            ans[k] = v;
          });
        }
      });
      return ans;
    };

    this.forEach = forEach;
    this.map = map;
  }
}

export function eo(obj) {
  return new ExtendedObj(obj);
}
