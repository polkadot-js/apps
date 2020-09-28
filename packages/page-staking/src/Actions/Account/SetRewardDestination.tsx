// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RewardDestination } from '@polkadot/types/interfaces';
import { DestinationType } from '../types';

import React, { useMemo, useState } from 'react';
import { Dropdown, InputAddress, Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../../translate';
import { createDestCurr } from '../destOptions';

interface Props {
  defaultDestination?: RewardDestination;
  controllerId: string;
  onClose: () => void;
  stashId: string;
}

function SetRewardDestination ({ controllerId, defaultDestination, onClose, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [destination, setDestination] = useState<DestinationType>(((defaultDestination?.isAccount ? 'Account' : defaultDestination?.toString()) || 'Staked') as 'Staked');
  const [destAccount, setDestAccount] = useState<string | null>(defaultDestination?.isAccount ? defaultDestination.asAccount.toString() : null);

  const options = useMemo(
    () => createDestCurr(t),
    [t]
  );

  const isAccount = destination === 'Account';

  return (
    <Modal
      header={t<string>('Bonding Preferences')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={stashId}
              isDisabled
              label={t<string>('stash account')}
            />
            <InputAddress
              defaultValue={controllerId}
              help={t<string>('The controller is the account that is be used to control any nominating or validating actions. I will sign this transaction.')}
              isDisabled
              label={t<string>('controller account')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The stash and controller pair as linked. This operation will be performed via the controller.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Dropdown
              defaultValue={defaultDestination?.toString()}
              help={t<string>('The destination account for any payments as either a nominator or validator')}
              label={t<string>('payment destination')}
              onChange={setDestination}
              options={options}
              value={destination}
            />
            {isAccount && (
              <InputAddress
                help={t('An account that is to receive the rewards')}
                label={t('the payment account')}
                onChange={setDestAccount}
                type='account'
                value={destAccount}
              />
            )}
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('All rewards will go towards the selected output destination when a payout is made.')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={controllerId}
          icon='sign-in-alt'
          isDisabled={!controllerId || (isAccount && !destAccount)}
          label={t<string>('Set reward destination')}
          onStart={onClose}
          params={[
            isAccount
              ? { Account: destAccount }
              : destination
          ]}
          tx='staking.setPayee'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(SetRewardDestination);
