// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakingAccount } from '@polkadot/api-derive/types';
import { AmountValidateState } from '../types';

import BN from 'bn.js';
import React, { useMemo, useState } from 'react';
import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { BalanceFree } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';
import ValidateAmount from './InputValidateAmount';

interface Props {
  onClose: () => void;
  stakingInfo?: DeriveStakingAccount;
  stashId: string;
}

function BondExtra ({ onClose, stakingInfo, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [amountError, setAmountError] = useState<AmountValidateState | null>(null);
  const [maxAdditional, setMaxAdditional] = useState<BN | undefined>();
  const [maxBalance] = useState<BN | undefined>();
  const currentAmount = useMemo(
    () => stakingInfo && stakingInfo.stakingLedger?.active.unwrap(),
    [stakingInfo]
  );

  return (
    <Modal
      className='staking--BondExtra'
      header= {t<string>('Bond more funds')}
      size='large'
    >
      <Modal.Content className='ui--signer-Signer-Content'>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={stashId}
              isDisabled
              label={t<string>('stash account')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Since this transaction deals with funding, the stash account will be used.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputBalance
              autoFocus
              help={t<string>('Amount to add to the currently bonded funds. This is adjusted using the available funds on the account.')}
              isError={!!amountError?.error || !maxAdditional || maxAdditional.eqn(0)}
              isWarning={!!amountError?.warning}
              label={t<string>('additional bonded funds')}
              labelExtra={
                <BalanceFree
                  label={<span className='label'>{t<string>('balance')}</span>}
                  params={stashId}
                />
              }
              maxValue={maxBalance}
              onChange={setMaxAdditional}
            />
            <ValidateAmount
              accountId={stashId}
              currentAmount={currentAmount}
              onError={setAmountError}
              value={maxAdditional}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The amount placed at-stake should be no more that 95% of your available amount to protect against slashing events.')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={stashId}
          icon='sign-in'
          isDisabled={!maxAdditional?.gt(BN_ZERO) || !!amountError?.error}
          isPrimary
          label={t<string>('Bond more')}
          onStart={onClose}
          params={[maxAdditional]}
          tx='staking.bondExtra'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(BondExtra);
