// Copyright 2017-2025 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { VoteTypeProps } from '../types.js';

import React, { useEffect, useState } from 'react';

import { ConvictionDropdown, Modal, VoteValue } from '@polkadot/react-components';

import { useTranslation } from '../../translate.js';

interface Props extends VoteTypeProps {
  voteLockingPeriod: BN;
}

function VoteStandard ({ accountId, id, isAye, onChange, voteLockingPeriod }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [balance, setBalance] = useState<BN | undefined>();
  const [conviction, setConviction] = useState(1);

  useEffect((): void => {
    onChange([id, {
      Standard: {
        balance,
        vote: {
          aye: isAye,
          conviction
        }
      }
    }]);
  }, [balance, conviction, id, isAye, onChange]);

  return (
    <Modal.Columns
      hint={
        <>
          <p>{t('The balance associated with the vote will be locked as per the conviction specified and will not be available for transfer during this period.')}</p>
          <p>{t('Conviction locks do overlap and are not additive, meaning that funds locked during a previous vote can be locked again.')}</p>
        </>
      }
    >
      <VoteValue
        accountId={accountId}
        autoFocus
        isReferenda={true}
        label={
          isAye
            ? t('aye vote value')
            : t('nay vote value')
        }
        onChange={setBalance}
      />
      <ConvictionDropdown
        label={t('conviction')}
        onChange={setConviction}
        value={conviction}
        voteLockingPeriod={voteLockingPeriod}
      />
    </Modal.Columns>
  );
}

export default React.memo(VoteStandard);
