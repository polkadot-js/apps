// Copyright 2017-2023 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { VoteTypeProps } from '../types';

import React, { useEffect, useState } from 'react';

import { ConvictionDropdown, Modal, VoteValue } from '@polkadot/react-components';

import { useTranslation } from '../../translate';

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
          <p>{t<string>('The balance associated with the vote will be locked as per the conviction specified and will not be available for transfer during this period.')}</p>
          <p>{t<string>('Conviction locks do overlap and are not additive, meaning that funds locked during a previous vote can be locked again.')}</p>
        </>
      }
    >
      <VoteValue
        accountId={accountId}
        autoFocus
        label={
          isAye
            ? t<string>('aye vote value')
            : t<string>('nay vote value')
        }
        onChange={setBalance}
      />
      <ConvictionDropdown
        help={t<string>('The conviction to use for this vote, with an appropriate lock period.')}
        label={t<string>('conviction')}
        onChange={setConviction}
        value={conviction}
        voteLockingPeriod={voteLockingPeriod}
      />
    </Modal.Columns>
  );
}

export default React.memo(VoteStandard);
