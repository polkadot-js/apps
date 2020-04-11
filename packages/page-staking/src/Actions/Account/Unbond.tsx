// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, StakingLedger } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { AddressInfo, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../../translate';
import useUnbondDuration from '../useUnbondDuration';

interface Props {
  className?: string;
  controllerId?: AccountId | null;
  onClose: () => void;
  stakingLedger?: StakingLedger;
  stashId: string;
}

function Unbond ({ className, controllerId, onClose, stakingLedger, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const duration = useUnbondDuration();
  const [maxBalance] = useState<BN | null>(stakingLedger?.active.unwrap() || null);
  const [maxUnbond, setMaxUnbond] = useState<BN | null>(null);

  return (
    <Modal
      className={`staking--Unbond ${className}`}
      header={t('Unbond funds')}
      size='small'
    >
      <Modal.Content className='ui--signer-Signer-Content'>
        <InputAddress
          className='medium'
          defaultValue={controllerId}
          isDisabled
          label={t('controller account')}
        />
        <div className='staking--Unbond--max'>
          <AddressInfo
            accountId={stashId}
            withBalance={{
              bonded: true
            }}
          />
        </div>
        <InputBalance
          autoFocus
          className='medium'
          help={t('The amount of funds to unbond, this is adjusted using the bonded funds on the stash account.')}
          label={t('unbond amount')}
          maxValue={maxBalance}
          onChange={setMaxUnbond}
          withMax
        />
        {duration?.gtn(0) && (
          <article className='warning'>
            <Trans key='unlockDuration'>Once unbonded, funds will only be available for withdrawal in <BlockToTime blocks={duration} /> ({formatNumber(duration)} blocks)</Trans>
          </article>
        )}
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={controllerId}
          icon='sign-out'
          isDisabled={!maxUnbond?.gtn(0)}
          isPrimary
          label={t('Unbond')}
          onStart={onClose}
          params={[maxUnbond]}
          tx='staking.unbond'
          withSpinner={false}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(Unbond)`
  article.warning > div {
    display: inline-block;
  }

  .staking--Unbond--max > div {
    justify-content: flex-end;

    & .column {
      flex: 0;
    }
  }
`);
