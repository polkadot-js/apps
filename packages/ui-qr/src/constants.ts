// Copyright 2017-2019 @polkadot/ui-qr authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const DEFAULT_SIZE = 300;

function createSize (size: number = DEFAULT_SIZE): { [index: string]: string } {
  const height = `${size}px`;

  return {
    height,
    width: height
  };
}

export {
  DEFAULT_SIZE,
  createSize
};
