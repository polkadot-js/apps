// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { DeriveStakerReward } from '@polkadot/api-derive/types';

import React, { useMemo } from 'react';
import { Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';

interface Props {
  controllerId: string;
  isValidator: boolean;
  onClose: () => void;
  stashId: string;
  stakingRewards: DeriveStakerReward[];
}

export default function ClaimRewards ({ controllerId, isValidator, onClose, stakingRewards }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const payoutTxs = useMemo((): SubmittableExtrinsic<'promise'>[] => {
    return stakingRewards
      .filter(({ isValidator: check }): boolean => check === isValidator)
      .map(({ era, nominating }): SubmittableExtrinsic<'promise'> =>
        isValidator
          ? api.tx.staking.payoutValidator(era)
          : api.tx.staking.payoutNominator(era, nominating)
      );
  }, [isValidator, stakingRewards]);

  return (
    <Modal
      header={
        isValidator
          ? t('Payout validator')
          : t('Payout nominator')
      }
      size='small'
    >
      <Modal.Content>
        {JSON.stringify(stakingRewards)}
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={controllerId}
          isPrimary
          label={t('Payout')}
          icon='sign-in'
          onStart={onClose}
          params={[payoutTxs]}
          tx='utility.batch'
        />
      </Modal.Actions>
    </Modal>
  );
}
