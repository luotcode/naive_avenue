import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginImport from "eslint-plugin-import";

export default [
  js.configs.recommended,
  {
    files: ["**/*.jsx", "**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        browser: true,
        es2021: true
      },
    },
    plugins: {
      react: pluginReact,
      import: pluginImport
    },
    rules: {
      "import/no-unresolved": ["error", { caseSensitive: true }]
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }
];
