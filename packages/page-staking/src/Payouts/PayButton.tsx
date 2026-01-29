// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { BatchOptions } from '@polkadot/react-hooks/types';
import type { u32 } from '@polkadot/types';
import type { EraIndex } from '@polkadot/types/interfaces';
import type { PayoutValidator } from './types.js';

import React, { useEffect, useMemo, useState } from 'react';

import { AddressMini, Button, InputAddress, Modal, Static, styled, TxButton } from '@polkadot/react-components';
import { useApi, useToggle, useTxBatch } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

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

    if (eras.every((e) => e.isClaimed)) {
      return null;
    }

    return eras.length === 1
      ? [api.tx.staking.payoutStakers(validatorId, eras[0].era)]
      : createStream(api, eras.filter((era) => !era.isClaimed).map((era): SinglePayout => ({ era: era.era, validatorId })));
  } else if (payout.length === 1) {
    if (payout[0].eras.every((e) => e.isClaimed)) {
      return null;
    }

    return createExtrinsics(api, payout[0]);
  }

  if (!payout.some((p) => p.eras.some((e) => !e.isClaimed))) {
    return null;
  }

  return createStream(api, payout.reduce((payouts: SinglePayout[], { eras, validatorId }): SinglePayout[] => {
    eras.forEach(({ era, isClaimed }): void => {
      if (!isClaimed) {
        payouts.push({ era, validatorId });
      }
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
  const batchOpts = useMemo<BatchOptions>(
    () => ({
      max: 36 * 64 / ((api.consts.staking.maxNominatorRewardedPerValidator as u32)?.toNumber() || 64),
      type: 'force'
    }),
    [api]
  );
  const extrinsics = useTxBatch(txs, batchOpts);

  useEffect((): void => {
    payout && setTxs(
      () => createExtrinsics(api, payout)
    );
  }, [api, payout]);

  const isPayoutEmpty = !payout || (!Array.isArray(payout) && !payout.eras.some((e) => !e.isClaimed)) || (Array.isArray(payout) && payout.some((p) => !p.eras.some((e) => !e.isClaimed))) || (Array.isArray(payout) && payout.length === 0);

  return (
    <>
      {payout && isVisible && (
        <StyledModal
          className={className}
          header={t('Payout all stakers')}
          onClose={togglePayout}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('Any account can request payout for stakers, this is not limited to accounts that will be rewarded.')}>
              <InputAddress
                label={t('request payout from')}
                onChange={setAccount}
                type='account'
                value={accountId}
              />
            </Modal.Columns>
            <Modal.Columns
              hint={
                <>
                  <p>{t('All the listed validators and all their nominators will receive their rewards.')}</p>
                  <p>{t('The UI puts a limit of 40 payouts at a time, where each payout is a single validator for a single era.')}</p>
                </>
              }
            >
              {Array.isArray(payout)
                ? (
                  <Static
                    label={t('payout stakers for (multiple)')}
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
                    label={t('payout stakers for (single)')}
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
              isDisabled={!extrinsics?.length || !accountId}
              label={t('Payout')}
              onStart={togglePayout}
            />
          </Modal.Actions>
        </StyledModal>
      )}
      <Button
        icon='credit-card'
        isDisabled={isDisabled || isPayoutEmpty}
        label={
          (isAll || Array.isArray(payout))
            ? t('Payout all')
            : t('Payout')
        }
        onClick={togglePayout}
      />
    </>
  );
}

const StyledModal = styled(Modal)`
  .ui--AddressMini.padded.addressStatic {
    display: inline-block;
    padding-top: 0.5rem;

    .ui--AddressMini-info {
      min-width: 10rem;
      max-width: 10rem;
    }
  }
`;

export default React.memo(PayButton);
