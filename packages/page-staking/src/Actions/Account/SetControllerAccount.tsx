// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import { InputAddress, Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../../translate';
import InputValidationController from './InputValidationController';

interface Props {
  defaultControllerId: string;
  onClose: () => void;
  stashId: string;
}

function SetControllerAccount ({ defaultControllerId, onClose, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [, setControllerError] = useState<string | null>(null);
  const [controllerId, setControllerId] = useState<string | null>(null);

  return (
    <Modal
      header={t('Change controller account')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              isDisabled
              label={t('stash account')}
              value={stashId}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('The stash account that is used. This will allow the controller to perform all non-funds related operations on behalf of the account.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
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
          </Modal.Column>
          <Modal.Column>
            <p>{t('The selected controller tied to this stash. Once set, this account will be able to control the actions performed by the stash account.')}</p>
          </Modal.Column>
        </Modal.Columns>
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
