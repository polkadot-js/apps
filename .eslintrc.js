const base = require('@polkadot/dev-react/config/eslint');

// add override for any (a metric ton of them, initial conversion)
module.exports = {
  ...base,
  rules: {
    ...base.rules,
    '@typescript-eslint/no-explicit-any': 'off'
  }
};
