// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import { recipientAddr } from '../../subjects';
import { amount } from './subjects';

export default function getValues (): Array<mixed> {
  return [
    recipientAddr.getValue(),
    amount.getValue()
  ];
}
