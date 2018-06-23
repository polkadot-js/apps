// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Param$Value, Param$Values } from '@polkadot/params/types';
import { RawParam } from '@polkadot/ui-app/Params/types';

function rawToValues (raw: Array<RawParam>): Array<Param$Values> {
  return raw.map(({ value }) =>
    (value as Param$Value)
  );
}

export default rawToValues;
