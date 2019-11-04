// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { InputBalance } from '@polkadot/react-components';
import { BalanceVoting } from '@polkadot/react-query';

import translate from '../translate';

interface Props extends I18nProps {
  accountId?: string | null;
  allBalances?: DerivedBalances;
  onChange: (value: BN) => void;
}

const ZERO = new BN(0);

function VoteValue ({ accountId, onChange, t }: Props): React.ReactElement<Props> {
  const _setVoteValue = (value?: BN): void => {
    onChange(value || ZERO);
  };

  return (
    <InputBalance
      help={t('The amount that is associated with this vote. This value is is locked for the duration of the vote.')}
      label={t('vote value')}
      labelExtra={<BalanceVoting label={t('voting balance ')} params={accountId} />}
      onChange={_setVoteValue}
    />
  );
}

export default translate(VoteValue);
