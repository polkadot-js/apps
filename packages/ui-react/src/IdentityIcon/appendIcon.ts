// Copyright 2017-2018 @polkadot/ui-react authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import identicon from '@polkadot/ui-identicon/index';

type NodeRefSet = (node: Element | null) => void;

export default function appendIcon (address: string | Uint8Array, size: number): NodeRefSet {
  return (node: Element | null): void => {
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
