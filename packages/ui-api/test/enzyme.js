/* eslint-disable @typescript-eslint/no-var-requires */
// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const Adapter = require('enzyme-adapter-react-16');
const Enzyme = require('enzyme');

Enzyme.configure({
  adapter: new Adapter()
});

module.exports = Enzyme;
