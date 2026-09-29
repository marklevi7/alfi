/* ALFI lint guard — enforces canonical MUI only. See CLAUDE.md. */
module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  settings: { react: { version: 'detect' } },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  rules: {
    // RULE: no raw hex colors anywhere. Use MUI theme tokens.
    'no-restricted-syntax': [
      'error',
      {
        selector: "Literal[value=/#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b/]",
        message: 'No hex colors. Use MUI theme tokens (palette/theme.palette.*).',
      },
      {
        selector: "TemplateElement[value.raw=/#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b/]",
        message: 'No hex colors in template strings. Use MUI theme tokens.',
      },
    ],
    // RULE: no custom-styled DOM primitives — build from MUI components.
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          { group: ['*.css', '*.scss', '*.sass'], message: 'No CSS files. Style via MUI sx/theme.' },
        ],
      },
    ],
  },
};
