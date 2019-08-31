const base = require('@polkadot/dev-react/config/eslint');

// add override for any (a metric ton of them, initial conversion)
module.exports = {
  ...base,
  parserOptions: {
    ...base.parserOptions,
    createDefaultProgram: false,
    extraFileExtensions: ['*.d.ts'],
    project: [
      './tsconfig.eslint.json'
    ]
  },
  rules: {
    ...base.rules,
    '@typescript-eslint/no-explicit-any': 'off'
  }
};
