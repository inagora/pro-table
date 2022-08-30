let ajaxSettings = {
  method: "GET",
  dataType: "json",
  accepts: {
    json: "application/json",
  },
  cache: true,
};

export default class Ajax {
  constructor(setting) {
    this.setting = Object.assign({}, ajaxSettings, setting);
  }
  request(options) {
    return new Promise((resolve, reject) => {
      const xhr = new window.XMLHttpRequest();

      const formData = new window.FormData();
      const setting = Object.assign({}, this.setting, options);

      Object.keys(setting).forEach((key) => {
        const value = setting[key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
          return;
        }

        formData.append(key, setting[key]);
      });

      xhr.onload = function onload() {
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(xhr);
        } else {
          resolve(xhr);
        }
      };

      xhr.open(setting.method, setting.url, true);

      if (setting.withCredentials && "withCredentials" in xhr) {
        xhr.withCredentials = true;
      }

      const headers = setting.headers || {};
      if (headers["X-Requested-With"] !== null) {
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      }

      for (const h in headers) {
        if (headers.hasOwnProperty(h) && headers[h] !== null) {
          xhr.setRequestHeader(h, headers[h]);
        }
      }
      xhr.send(formData);
    });
  }
}
