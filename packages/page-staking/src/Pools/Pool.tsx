// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';

import React from 'react';

import { AccountName } from '@polkadot/react-components';
import { stringify } from '@polkadot/util';

import usePoolInfo from './usePoolInfo';

interface Props {
  className?: string;
  id: AccountId;
}

function Pool ({ className, id }: Props): React.ReactElement<Props> {
  const info = usePoolInfo(id);

  return (
    <tr className={className}>
      <td><AccountName value={id} /></td>
      <td>{stringify(info)}</td>
    </tr>
  );
}

export default React.memo(Pool);
