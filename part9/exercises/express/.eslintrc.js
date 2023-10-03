module.exports = {
    "env": {
        "es2021": true,
        "node": true
    },
    "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:@typescript-eslint/recommended-requiring-type-checking"],
    "plugins": ["@typescript-eslint"],
    "overrides": [
        {
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "rules": {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/restrict-plus-operands": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_"}],
      "no-case-declarations": "off"
    },
    parser: "@typescript-eslint/parser",
    "parserOptions": {
      "project": "./tsconfig.json"
    },
}
