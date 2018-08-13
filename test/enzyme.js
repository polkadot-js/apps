// Copyright 2017-2018 @polkadot authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

const Adapter = require('enzyme-adapter-react-16');
const Enzyme = require('enzyme');

Enzyme.configure({
  adapter: new Adapter()
});

module.exports = Enzyme;
