// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import createElement from './element';

export default function rect (size: number): Element {
  const elem = createElement(size, 'rect');

  elem.setAttributeNS('', 'rx', `${size / 16}`);
  elem.setAttributeNS('', 'ry', `${size / 16}`);

  return elem;
}
