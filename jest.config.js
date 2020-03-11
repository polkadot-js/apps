/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('@polkadot/dev/config/jest');
const findPackages = require('./scripts/findPackages');

const internalModules = findPackages()
  .filter(({ name }) => !['@polkadot/apps'].includes(name))
  .reduce((modules, { dir, name }) => {
    modules[`${name}(.*)$`] = `<rootDir>/packages/${dir}/src/$1`;

    return modules;
  }, {});

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    ...internalModules,
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'empty/object',
    '\\.(css|less)$': 'empty/object'
  }
});
