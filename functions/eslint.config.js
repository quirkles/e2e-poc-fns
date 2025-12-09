import { defineConfig } from "@eslint/config-helpers";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { flatConfigs } from "eslint-plugin-import";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import tsEslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: [
      "dist/",
      "node_modules/",
      "**/*.d.ts",
      "coverage/",
      "lib/**/*",
      "generated/**/*",
    ],
  },
  tsEslint.configs.recommendedTypeChecked,
  tsEslint.configs.strictTypeChecked,
  tsEslint.configs.stylisticTypeChecked,
  flatConfigs.typescript,
  prettierRecommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    rules: {
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
            caseInsensitive: false,
          },
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          pathGroups: [],
        },
      ],
    },
  },
]);
