// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PayoutValidator } from './types';

import React from 'react';

interface Props {
  className?: string;
  payout: PayoutValidator;
}

function Payout ({ className }: Props): React.ReactElement<Props> {
  return (
    <tr className={className}>&nbsp;</tr>
  );
}

export default React.memo(Payout);
