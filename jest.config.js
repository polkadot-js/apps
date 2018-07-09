const config = require('@polkadot/dev-react/config/jest');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@polkadot/app-(accounts|addresses|example|explorer|extrinsics|rpc|storage|toolbox|vanitygen)(.*)$': '<rootDir>/packages/ui-$1/src/$2',
    '@polkadot/ui-(app|identicon|keyring|react-rx|react|signer)(.*)$': '<rootDir>/packages/ui-$1/src/$2',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'empty/object',
    '\\.(css|less)$': 'empty/object'
  }
});
