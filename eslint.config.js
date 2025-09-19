import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

// Flat config
export default tseslint.config(
  {
    // Globally ignored paths
    ignores: [
      "dist",
      ".next",
      "node_modules",
      "server/node_modules",
      "coverage",
      "public",
      // Legacy/unused folders and files that contain non-standard syntax
      "BACKEND",
      "api",
      "ecosystem.config.js",
      "scripts/design-system-audit.js",
      "**/*.backup",
      "**/*.backup.*",
    ],
  },
  // Enable Next.js rules (core-web-vitals)
  ...compat.config({
    extends: ["next/core-web-vitals"],
  }),
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "unused-imports": unusedImports,
      // Expose TS plugin under the legacy alias so CLI rules like
      // "@typescript-eslint/no-unused-vars" resolve without errors.
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      // React hooks sanity
      ...reactHooks.configs.recommended.rules,
      // Disable noisy Fast Refresh constraint in this repo
      "react-refresh/only-export-components": "off",
      // Auto-remove unused imports and flag unused vars
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // Turn off base TS rule to avoid duplicate reports
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-this-alias": "off",
      // Minor cosmetic rule
      "no-useless-escape": "warn",
      // Too noisy for this codebase; prefer manual review
      "react-hooks/exhaustive-deps": "off",
    },
  },
  // Config and tooling overrides
  {
    files: [
      "tailwind.config.ts",
      "**/*.config.{js,ts,mjs,cjs}",
      "next.config.*",
      "playwright.config.*",
    ],
    rules: {
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);
