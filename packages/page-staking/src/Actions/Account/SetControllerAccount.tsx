// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import { Icon, InputAddress, Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../../translate';
import InputValidationController from './InputValidationController';

interface Props {
  defaultControllerId: string;
  isValidating?: boolean;
  onClose: () => void;
  stashId: string;
}

function SetControllerAccount ({ defaultControllerId, isValidating, onClose, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [, setControllerError] = useState<string | null>(null);
  const [controllerId, setControllerId] = useState<string | null>(null);

  return (
    <Modal
      className='staking--SetControllerAccount'
      header={t('Change controller account')}
      size='small'
    >
      <Modal.Content className='ui--signer-Signer-Content'>
        {isValidating && (
          <article className='warning'>
            <div className='warning'>
              <Icon name='warning sign' />
              {t('Warning - Changing the controller while validating will modify the associated session account. It is advised to stop validating before changing the controller account.')}
            </div>
          </article>
        )}
        <InputAddress
          className='medium'
          isDisabled
          label={t('stash account')}
          value={stashId}
        />
        <InputAddress
          className='medium'
          defaultValue={defaultControllerId}
          help={t('The controller is the account that will be used to control any nominating or validating actions. Should not match another stash or controller.')}
          label={t('controller account')}
          onChange={setControllerId}
          type='account'
          value={controllerId}
        />
        <InputValidationController
          accountId={stashId}
          controllerId={controllerId}
          defaultController={defaultControllerId}
          onError={setControllerError}
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={stashId}
          icon='sign-in'
          isDisabled={!controllerId}
          isPrimary
          label={t('Set controller')}
          onStart={onClose}
          params={[controllerId]}
          tx='staking.setController'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(SetControllerAccount);
