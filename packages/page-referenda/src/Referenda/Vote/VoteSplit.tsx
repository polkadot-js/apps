// Copyright 2017-2023 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { VoteTypeProps as Props } from '../types';

import React, { useEffect, useState } from 'react';

import { Modal, VoteValue } from '@polkadot/react-components';

import { useTranslation } from '../../translate';

function VoteSplit ({ accountId, id, onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [balanceAye, setBalanceAye] = useState<BN | undefined>();
  const [balanceNay, setBalanceNay] = useState<BN | undefined>();

  useEffect((): void => {
    onChange([id, {
      Split: {
        aye: balanceAye,
        nay: balanceNay
      }
    }]);
  }, [balanceAye, balanceNay, id, onChange]);

  return (
    <Modal.Columns hint={t<string>('The value of the balance that is to be split to the aye and nay parts of the vote')}>
      <VoteValue
        accountId={accountId}
        autoFocus
        label={t<string>('aye vote value')}
        onChange={setBalanceAye}
      />
      <VoteValue
        accountId={accountId}
        label={t<string>('nay vote value')}
        noDefault
        onChange={setBalanceNay}
      />
    </Modal.Columns>
  );
}

export default React.memo(VoteSplit);
