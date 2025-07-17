import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      ".next",
      "out",
      "*.min.js",
      "lib/generated/**",
    ],
  },
  ...tseslint.config({
    files: ["**/*.ts", "**/*.tsx", "**/*.js"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  }),
];
