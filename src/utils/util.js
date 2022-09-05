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
let csses = {};
export function loadCss(url) {
  if (csses[url]) return csses[url];
  else {
    let p = new Promise((resolve) => {
      let css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = url;
      document.head.insertBefore(
        css,
        document.head.childNodes[document.head.childNodes.length - 1]
          .nextSibling
      );
      resolve();
    });
    csses[url] = p;
    return p;
  }
}
