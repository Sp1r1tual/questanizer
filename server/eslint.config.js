import js from "@eslint/js";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,

  {
    files: ["**/*.{js,mjs}"],
    ignores: ["node_modules", "dist"],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        beforeAll: "readonly",
        afterEach: "readonly",
      },
    },

    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "node/no-unsupported-features/es-syntax": "off",
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
      "prefer-const": "error",
      "no-var": "error",
      "no-duplicate-imports": "error",
      "no-console": "warn",
      "no-debugger": "error",
      "require-await": "error",
      eqeqeq: ["error", "always"],
    },
  },
]);
