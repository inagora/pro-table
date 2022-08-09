module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/recommended", "prettier"],
  plugins: ["vue"],
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module",
    ecmaVersion: "2019",
  },
  rules: {
    indent: ["error", "tab", { SwitchCase: 1 }],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "no-debugger": 0,
    "object-shorthand": ["error", "always"],
    "one-var": [
      2,
      {
        var: "never",
        let: "never",
        const: "never",
      },
    ],
    "comma-spacing": ["error", { before: false, after: true }],
    "implicit-arrow-linebreak": ["error", "beside"],
    "no-console": 0,
    "no-unused-vars": ["error"],
    "key-spacing": [
      "error",
      { beforeColon: false, afterColon: true, mode: "strict" },
    ],
    "no-invalid-regexp": "error",
    "vue/html-self-closing": 0,
    "vue/html-indent": ["error", "tab"],
    "vue/singleline-html-element-content-newline": 0,
    "vue/max-attributes-per-line": 0,
    "vue/no-v-html": "off",
    "number-max-precision": "off",
  },
  globals: {
    Vue: false,
  },
};
