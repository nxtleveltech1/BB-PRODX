import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

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
    },
    rules: {
      // React hooks sanity
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // Pragmatic TypeScript defaults for this repo
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-this-alias": "off",
      // Minor cosmetic rule
      "no-useless-escape": "warn",
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
