import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    env: {
      es6: true,
      browser: true,
      commonjs: true,
      jquery: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "prettier",
      "plugin:prettier/recommended",
    ],
    parser: "@typescript-eslint/parser",
    settings: {
      "import/resolver": {
        node: {
          paths: ["src"],
        },
      },
    },
    parserOptions: {
      sourceType: "module",
      ecmaFeatures: {
        modules: true,
      },
    },
    plugins: ["@typescript-eslint", "prettier"],
    rules: {
      indent: ["error", 4, { SwitchCase: 1 }],
      "comma-dangle": 0,
      "no-underscore-dangle": ["error"],
      "import/no-unresolved": "off",
      "no-unused-vars": 0,
    },
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];
