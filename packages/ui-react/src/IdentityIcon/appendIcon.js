// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import identicon from '@polkadot/ui-identicon';

type NodeRefSet = (node: ?Element) => void;

export default function appendIcon (address: string | Uint8Array, size: number): NodeRefSet {
  return (node: ?Element): void => {
    if (node) {
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }

      node.appendChild(
        identicon(address, size)
      );
    }
  };
}
