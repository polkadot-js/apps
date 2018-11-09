// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import createSvg from './svg';

export default function circle (r: number, cx: number, cy: number): Element {
  const elem = createSvg('circle');

  elem.setAttributeNS('', 'cx', `${cx}`);
  elem.setAttributeNS('', 'cy', `${cy}`);
  elem.setAttributeNS('', 'r', `${r}`);

  return elem;
}
