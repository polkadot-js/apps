// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';

import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import { Button, Modal, InputAddress, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  eras: BN[];
  isInElection?: boolean;
  validatorId: string;
}

function PayButton ({ eras, isInElection, validatorId }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const [isVisible, togglePayout] = useToggle();
  const [accountId, setAccount] = useState<string | null>(null);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);

  useEffect((): void => {
    setExtrinsic(
      () => eras.length === 1
        ? api.tx.staking.payoutStakers(validatorId, eras[0])
        : api.tx.utility.batch(
          eras.map((era): SubmittableExtrinsic<'promise'> =>
            api.tx.staking.payoutStakers(validatorId, era)
          )
        )
    );
  }, [api, eras, validatorId]);

  return (
    <>
      {isVisible && (
        <Modal header={t('Payout all stakers')}>
          <Modal.Content>
            <InputAddress
              isDisabled
              label={t('payout stakers for')}
              value={validatorId}
            />
            <InputAddress
              label={t('request from')}
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
        isDisabled={isInElection}
        label={t('Payout')}
        onClick={togglePayout}
      />
    </>
  );
}

export default React.memo(PayButton);
