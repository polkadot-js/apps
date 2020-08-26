const base = require('@polkadot/dev/config/eslint');

// add override for any (a metric ton of them, initial conversion)
module.exports = {
  ...base,
  parserOptions: {
    ...base.parserOptions,
    project: [
      './tsconfig.json'
    ]
  },
  rules: {
    ...base.rules,
    '@typescript-eslint/no-explicit-any': 'off',
    // this is yielding false positives
    '@typescript-eslint/unbound-method': 'off'
  }
};
