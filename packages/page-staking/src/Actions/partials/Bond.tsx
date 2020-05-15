// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BondInfo } from './types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useState } from 'react';
import { Dropdown, InputAddress, InputBalance, Modal, Static } from '@polkadot/react-components';
import { Available, BlockToTime } from '@polkadot/react-query';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import InputValidateAmount from '../Account/InputValidateAmount';
import InputValidationController from '../Account/InputValidationController';
import { rewardDestinationOptions } from '../constants';
import useUnbondDuration from '../useUnbondDuration';

interface Props {
  className?: string;
  onChange: (info: BondInfo) => void;
}

function Bond ({ className, onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>();
  const [amountError, setAmountError] = useState<string | null>(null);
  const [controllerError, setControllerError] = useState<boolean>(false);
  const [controllerId, setControllerId] = useState<string | null>(null);
  const [destination, setDestination] = useState(0);
  const [stashId, setStashId] = useState<string | null>(null);
  const bondedBlocks = useUnbondDuration();

  const _setError = useCallback(
    // eslint-disable-next-line handle-callback-err
    (error: string | null, isFatal: boolean) => setControllerError(isFatal),
    []
  );

  useEffect((): void => {
    onChange(
      (amount && amount.gtn(0) && !controllerError && controllerId && stashId)
        ? {
          bondOwnTx: api.tx.staking.bond(stashId, amount, destination),
          bondTx: api.tx.staking.bond(controllerId, amount, destination),
          controllerId,
          controllerTx: api.tx.staking.setController(controllerId),
          stashId
        }
        : {
          bondTx: null,
          controllerId: null,
          stashId: null
        }
    );
  }, [api, amount, controllerError, controllerId, destination, stashId, onChange]);

  const hasValue = !!amount?.gtn(0);

  return (
    <div className={className}>
      <Modal.Columns>
        <Modal.Column>
          <InputAddress
            label={t('stash account')}
            onChange={setStashId}
            type='account'
            value={stashId}
          />
          <InputAddress
            help={t('The controller is the account that will be used to control any nominating or validating actions. Should not match another stash or controller.')}
            label={t('controller account')}
            onChange={setControllerId}
            type='account'
            value={controllerId}
          />
          <InputValidationController
            accountId={stashId}
            controllerId={controllerId}
            onError={_setError}
          />
        </Modal.Column>
        <Modal.Column>
          <p>{t('Think of the stash as your cold wallet and the controller as your hot wallet. Funding operations are controlled by the stash, any other non-funding actions by the controller itself.')}</p>
          <p>{t('To ensure optimal fund security using the same stash/controller is strongly discouraged, but not forbidden.')}</p>
        </Modal.Column>
      </Modal.Columns>
      <Modal.Columns>
        <Modal.Column>
          <InputBalance
            autoFocus
            help={t('The total amount of the stash balance that will be at stake in any forthcoming rounds (should be less than the total amount available)')}
            isError={!hasValue || !!amountError}
            label={t('value bonded')}
            labelExtra={
              <Available
                label={<span className='label'>{t('available')}</span>}
                params={stashId}
              />
            }
            onChange={setAmount}
          />
          {bondedBlocks?.gtn(0) && (
            <Static
              help={t('The bonding duration for any staked funds. Needs to be unlocked and withdrawn to become available.')}
              label={t('on-chain bonding duration')}
            >
              <BlockToTime blocks={bondedBlocks} />
            </Static>
          )}
          <InputValidateAmount
            accountId={stashId}
            onError={setAmountError}
            value={amount}
          />
        </Modal.Column>
        <Modal.Column>
          <p>{t('The amount placed at-stake should be no more that 95% of your available amount to protect against slashing events.')}</p>
          <p>{t('Once bonded, it wil need to be unlocked/withdrawn and will be locked for at least the bonding duration.')}</p>
        </Modal.Column>
      </Modal.Columns>
      <Modal.Columns>
        <Modal.Column>
          <Dropdown
            defaultValue={0}
            help={t('The destination account for any payments as either a nominator or validator')}
            label={t('payment destination')}
            onChange={setDestination}
            options={rewardDestinationOptions}
            value={destination}
          />
        </Modal.Column>
        <Modal.Column>
          <p>{t('Rewards (once paid) can be deposited to either the stash or controller, with different effects.')}</p>
        </Modal.Column>
      </Modal.Columns>
    </div>
  );
}

export default React.memo(Bond);
