export default [
  {
    ignores: ["node_modules"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "indent": ["error", 2],
      "no-unused-vars": "warn",
      "no-console": "off"
    }
  }
];
