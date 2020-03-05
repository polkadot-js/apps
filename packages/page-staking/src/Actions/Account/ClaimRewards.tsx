// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { DeriveStakerReward } from '@polkadot/api-derive/types';
import { EraIndex } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import { Modal, Table, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';

interface Props {
  controllerId: string;
  onClose: () => void;
  stakingRewards: DeriveStakerReward[];
}

export default function ClaimRewards ({ controllerId, onClose, stakingRewards }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [tx, params] = useMemo((): [string, [SubmittableExtrinsic<'promise'>[]] | [EraIndex] | [EraIndex, [string, number][]]] => {
    if (stakingRewards.length === 1) {
      const { era, isValidator, nominating } = stakingRewards[0];

      return isValidator
        ? ['staking.payoutValidator', [era]]
        : ['staking.payoutNominator', [era, nominating]];
    }

    return ['utility.batch', [stakingRewards.map(({ era, isValidator, nominating }): SubmittableExtrinsic<'promise'> =>
      isValidator
        ? api.tx.staking.payoutValidator(era)
        : api.tx.staking.payoutNominator(era, nominating)
    )]];
  }, [stakingRewards]);
  const payoutInfo = useMemo((): [EraIndex, boolean, number][] => {
    return stakingRewards.map(({ era, isValidator, nominating }) => [
      era,
      isValidator,
      isValidator
        ? 1
        : nominating.length
    ]);
  }, [stakingRewards]);

  return (
    <Modal
      header={t('Payout era rewards')}
      size='small'
    >
      <Modal.Content>
        <Table>
          {payoutInfo.map(([era,, count], index): React.ReactNode =>
            <tr key={index}>
              <td className='number together'>{era.toHuman()}</td>
              <td className='number together'>{t('{{count}} rewards', {
                replace: { count }
              })}</td>
            </tr>
          )}
        </Table>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={controllerId}
          isPrimary
          label={t('Payout')}
          icon='sign-in'
          onStart={onClose}
          params={[params]}
          tx={tx}
        />
      </Modal.Actions>
    </Modal>
  );
}
