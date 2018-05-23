// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param$Value, Param$Values } from '@polkadot/params/types';
import type { RawParam } from '@polkadot/ui-app/Params/types';

function rawToValues (raw: Array<RawParam>): Array<Param$Values> {
  return raw.map(({ value }) =>
    // flowlint-next-line unclear-type:off
    ((value: any): Param$Value)
  );
}

export default rawToValues;
