// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';

import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import InputValidationController from './InputValidationController';

interface Props {
  defaultControllerId: string;
  onClose: () => void;
  stashId: string;
}

function SetControllerAccount ({ defaultControllerId, onClose, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isFatal, setIsFatal] = useState(false);
  const [controllerId, setControllerId] = useState<string | null>(null);

  const _setError = useCallback(
    (_: string | null, isFatal: boolean) => setIsFatal(isFatal),
    []
  );

  return (
    <Modal
      header={t<string>('Change controller account')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('The stash account that is used. This will allow the controller to perform all non-funds related operations on behalf of the account.')}>
          <InputAddress
            isDisabled
            label={t<string>('stash account')}
            value={stashId}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The selected controller tied to this stash. Once set, this account will be able to control the actions performed by the stash account.')}>
          <InputAddress
            defaultValue={defaultControllerId}
            help={t<string>('The controller is the account that will be used to control any nominating or validating actions. Should not match another stash or controller.')}
            label={t<string>('controller account')}
            onChange={setControllerId}
            type='account'
            value={controllerId}
          />
          <InputValidationController
            accountId={stashId}
            controllerId={controllerId}
            defaultController={defaultControllerId}
            onError={_setError}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={stashId}
          icon='sign-in-alt'
          isDisabled={!controllerId || isFatal}
          label={t<string>('Set controller')}
          onStart={onClose}
          params={[controllerId]}
          tx={api.tx.staking.setController}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(SetControllerAccount);
