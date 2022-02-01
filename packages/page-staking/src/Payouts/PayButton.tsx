// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { EraIndex } from '@polkadot/types/interfaces';
import type { PayoutValidator } from './types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { ApiPromise } from '@polkadot/api';
import { AddressMini, Button, InputAddress, Modal, Static, TxButton } from '@polkadot/react-components';
import { useApi, useToggle, useTxBatch } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isAll?: boolean;
  isDisabled?: boolean;
  payout?: PayoutValidator | PayoutValidator[];
}

interface SinglePayout {
  era: EraIndex;
  validatorId: string;
}

function createStream (api: ApiPromise, payouts: SinglePayout[]): SubmittableExtrinsic<'promise'>[] {
  return payouts
    .sort((a, b) => a.era.cmp(b.era))
    .map(({ era, validatorId }) =>
      api.tx.staking.payoutStakers(validatorId, era)
    );
}

function createExtrinsics (api: ApiPromise, payout: PayoutValidator | PayoutValidator[]): SubmittableExtrinsic<'promise'>[] | null {
  if (!Array.isArray(payout)) {
    const { eras, validatorId } = payout;

    return eras.length === 1
      ? [api.tx.staking.payoutStakers(validatorId, eras[0].era)]
      : createStream(api, eras.map((era): SinglePayout => ({ era: era.era, validatorId })));
  } else if (payout.length === 1) {
    return createExtrinsics(api, payout[0]);
  }

  return createStream(api, payout.reduce((payouts: SinglePayout[], { eras, validatorId }): SinglePayout[] => {
    eras.forEach(({ era }): void => {
      payouts.push({ era, validatorId });
    });

    return payouts;
  }, []));
}

function PayButton ({ className, isAll, isDisabled, payout }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isVisible, togglePayout] = useToggle();
  const [accountId, setAccount] = useState<string | null>(null);
  const [txs, setTxs] = useState<SubmittableExtrinsic<'promise'>[] | null>(null);
  const extrinsics = useTxBatch(txs, { batchSize: 36 * 64 / (api.consts.staking.maxNominatorRewardedPerValidator?.toNumber() || 64) });

  useEffect((): void => {
    payout && setTxs(
      () => createExtrinsics(api, payout)
    );
  }, [api, payout]);

  const isPayoutEmpty = !payout || (Array.isArray(payout) && payout.length === 0);

  return (
    <>
      {payout && isVisible && (
        <Modal
          className={className}
          header={t<string>('Payout all stakers')}
          onClose={togglePayout}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('Any account can request payout for stakers, this is not limited to accounts that will be rewarded.')}>
              <InputAddress
                label={t<string>('request payout from')}
                onChange={setAccount}
                type='account'
                value={accountId}
              />
            </Modal.Columns>
            <Modal.Columns
              hint={
                <>
                  <p>{t<string>('All the listed validators and all their nominators will receive their rewards.')}</p>
                  <p>{t<string>('The UI puts a limit of 40 payouts at a time, where each payout is a single validator for a single era.')}</p>
                </>
              }
            >
              {Array.isArray(payout)
                ? (
                  <Static
                    label={t<string>('payout stakers for (multiple)')}
                    value={
                      payout.map(({ validatorId }) => (
                        <AddressMini
                          className='addressStatic'
                          key={validatorId}
                          value={validatorId}
                        />
                      ))
                    }
                  />
                )
                : (
                  <InputAddress
                    defaultValue={payout.validatorId}
                    isDisabled
                    label={t<string>('payout stakers for (single)')}
                  />
                )
              }
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              extrinsic={extrinsics}
              icon='credit-card'
              isDisabled={!extrinsics || !extrinsics.length || !accountId}
              label={t<string>('Payout')}
              onStart={togglePayout}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='credit-card'
        isDisabled={isDisabled || isPayoutEmpty}
        label={
          (isAll || Array.isArray(payout))
            ? t<string>('Payout all')
            : t<string>('Payout')
        }
        onClick={togglePayout}
      />
    </>
  );
}

export default React.memo(styled(PayButton)`
  .ui--AddressMini.padded.addressStatic {
    padding-top: 0.5rem;

    .ui--AddressMini-info {
      min-width: 10rem;
      max-width: 10rem;
    }
  }
`);
