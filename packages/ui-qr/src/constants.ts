// Copyright 2017-2019 @polkadot/ui-qr authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const DEFAULT_SIZE = 300;
const ADDRESS_PREFIX = 'substrate:';

function createSize (size: number = DEFAULT_SIZE): Record<string, string> {
  const height = `${size}px`;

  return {
    height,
    width: height
  };
}

export {
  ADDRESS_PREFIX,
  DEFAULT_SIZE,
  createSize
};
