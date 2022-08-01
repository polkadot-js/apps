// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletReferendaDeposit } from '@polkadot/types/lookup';

import React, { useMemo } from 'react';

import { AddressMini } from '@polkadot/react-components';

interface Props {
  decision: Option<PalletReferendaDeposit> | null;
  submit: PalletReferendaDeposit | null;
}

function Tuple ({ decision, submit }: Props): React.ReactElement<Props> {
  const [first, second] = useMemo(
    () => [submit, decision && decision.unwrapOr(null)],
    [decision, submit]
  );

  return (
    <td className='address'>
      {first && (
        <AddressMini
          balance={first.amount}
          value={first.who}
          withBalance
        />
      )}
      {second && (
        <AddressMini
          balance={second.amount}
          value={second.who}
          withBalance
        />
      )}
    </td>
  );
}

export default React.memo(Tuple);
