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

interface Props {
  isInElection?: boolean;
  payout?: PayoutValidator | PayoutValidator[];
}

function createExtrinsic (api: ApiPromise, payout: PayoutValidator | PayoutValidator[]): SubmittableExtrinsic<'promise'> {
  if (Array.isArray(payout)) {
    if (payout.length === 1) {
      return createExtrinsic(api, payout[0]);
    }

    return api.tx.utility.batch(
      payout.reduce((calls: SubmittableExtrinsic<'promise'>[], { eras, validatorId }): SubmittableExtrinsic<'promise'>[] =>
        calls.concat(
          ...eras.map(({ era }) => api.tx.staking.payoutStakers(validatorId, era))
        ), [])
    );
  }

  const { eras, validatorId } = payout;

  return eras.length === 1
    ? api.tx.staking.payoutStakers(validatorId, eras[0].era)
    : api.tx.utility.batch(
      eras.map(({ era }) => api.tx.staking.payoutStakers(validatorId, era))
    );
}

function PayButton ({ isInElection, payout }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const [isVisible, togglePayout] = useToggle();
  const [accountId, setAccount] = useState<string | null>(null);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);

  useEffect((): void => {
    payout && setExtrinsic(
      () => createExtrinsic(api, payout)
    );
  }, [api, payout]);

  const isPayoutEmpty = !payout || (Array.isArray(payout) && payout.length === 0);

  return (
    <>
      {payout && isVisible && (
        <Modal header={t('Payout all stakers')}>
          <Modal.Content>
            {Array.isArray(payout)
              ? (
                <Static
                  label={t('payout stakers for (multiple)')}
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
                  label={t('payout stakers for (single)')}
                />
              )
            }
            <InputAddress
              label={t('request payout from')}
              onChange={setAccount}
              type='account'
              value={accountId}
            />
          </Modal.Content>
          <Modal.Actions onCancel={togglePayout}>
            <TxButton
              accountId={accountId}
              extrinsic={extrinsic}
              icon='credit card outline'
              isDisabled={!extrinsic || !accountId}
              label={t('Payout')}
              onStart={togglePayout}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='percent'
        isDisabled={isInElection || isPayoutEmpty}
        label={Array.isArray(payout) ? t('Payout all') : t('Payout')}
        onClick={togglePayout}
      />
    </>
  );
}

export default React.memo(PayButton);
