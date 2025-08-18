import js from "@eslint/js";
import globals from "globals";

import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import prettierPlugin from "eslint-plugin-prettier";

import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,

  {
    files: ["**/*.{js,jsx}"],
    ignores: ["node_modules", "dist"],

    languageOptions: {
      globals: { ...globals.node, ...globals.browser, ...globals.es2021 },
      parserOptions: reactPlugin.configs.recommended.parserOptions,
    },

    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      prettier: prettierPlugin,
    },

    rules: {
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-no-target-blank": "off",
      "prettier/prettier": "error",
      "prefer-const": "error",
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-key": "error",
      "react/no-array-index-key": "error",
      "react/self-closing-comp": "error",
      "react/jsx-curly-brace-presence": "warn",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-duplicate-imports": "error",
      "no-console": "warn",
      "no-debugger": "error",
      "require-await": "error",
      eqeqeq: ["error", "always"],
    },
  },
]);
