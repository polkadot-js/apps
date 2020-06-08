// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { PayoutValidator } from './types';

import React, { useState, useEffect } from 'react';
import { ApiPromise } from '@polkadot/api';
import { AddressMini, Button, Modal, InputAddress, Static, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

const MAX_BATCH_SIZE = 40;

interface Props {
  isAll?: boolean;
  isDisabled?: boolean;
  payout?: PayoutValidator | PayoutValidator[];
}

function createExtrinsic (api: ApiPromise, payout: PayoutValidator | PayoutValidator[]): SubmittableExtrinsic<'promise'> | null {
  if (Array.isArray(payout)) {
    if (payout.length === 1) {
      return createExtrinsic(api, payout[0]);
    }

    return api.tx.utility.batch(
      payout.reduce((calls: SubmittableExtrinsic<'promise'>[], { eras, validatorId }): SubmittableExtrinsic<'promise'>[] =>
        calls.concat(
          ...eras.map(({ era }) => api.tx.staking.payoutStakers(validatorId, era))
        ), []
      ).filter((_, index) => index < MAX_BATCH_SIZE)
    );
  }

  const { eras, validatorId } = payout;

  return eras.length === 1
    ? api.tx.staking.payoutStakers(validatorId, eras[0].era)
    : api.tx.utility.batch(
      eras
        .map(({ era }) => api.tx.staking.payoutStakers(validatorId, era))
        .filter((_, index) => index < MAX_BATCH_SIZE)
    );
}

function PayButton ({ isAll, isDisabled, payout }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const [isVisible, togglePayout] = useToggle();
  const [accountId, setAccount] = useState<string | null>(null);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);

  useEffect((): void => {
    api.tx.utility && payout && setExtrinsic(
      () => createExtrinsic(api, payout)
    );
  }, [api, isDisabled, payout]);

  const isPayoutEmpty = !payout || (Array.isArray(payout) && payout.length === 0);

  return (
    <>
      {payout && isVisible && (
        <Modal
          header={t<string>('Payout all stakers')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  label={t<string>('request payout from')}
                  onChange={setAccount}
                  type='account'
                  value={accountId}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('Any account can request payout for stakers, this is not limited to accounts that will be rewarded.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                {Array.isArray(payout)
                  ? (
                    <Static
                      label={t<string>('payout stakers for (multiple)')}
                      value={
                        payout.map(({ validatorId }) => (
                          <AddressMini
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
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('All the listed validators and all their nominators will receive their rewards.')}</p>
                <p>{t<string>('The UI puts a limit of 40 payouts at a time, where each payout is a single validator for a single era.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={togglePayout}>
            <TxButton
              accountId={accountId}
              extrinsic={extrinsic}
              icon='credit card outline'
              isDisabled={!extrinsic || !accountId}
              label={t<string>('Payout')}
              onStart={togglePayout}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='credit card outline'
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

export default React.memo(PayButton);
