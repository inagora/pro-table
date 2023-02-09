let jses = {};
export function loadJs(url) {
  if (jses[url]) return jses[url];
  else {
    let p = new Promise((resolve) => {
      let head =
          document.getElementsByTagName("head")[0] || document.documentElement,
        script = document.createElement("script");
      script.src = url;
      script.onload = script.onreadystatechange = function () {
        if (
          !this.readyState ||
          this.readyState == "loaded" ||
          this.readyState == "complete"
        ) {
          script.onload = script.onreadystatechange = null;
          head.removeChild(script);
          resolve();
        }
      };
      head.insertBefore(script, head.firstChild);
    });
    jses[url] = p;
    return p;
  }
}

let class2type = {},
  toString = class2type.toString;
"Boolean Number String Function Array Date RegExp Object Error"
  .split(" ")
  .forEach((name) => {
    class2type["[object " + name + "]"] = name.toLowerCase();
  });

export function $type(obj) {
  return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
}

export function isObject(obj) {
  return $type(obj) == "object";
}

export function isPlainObject(obj) {
  return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
}
export function isFuction(obj) {
  return obj instanceof Function;
}
