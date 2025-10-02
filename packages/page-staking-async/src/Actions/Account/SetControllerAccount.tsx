// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from 'react';

import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate.js';
import InputValidationController from './InputValidationController.js';

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

  const needsController = useMemo(
    () => api.tx.staking.setController.meta.args.length === 1,
    [api]
  );

  return (
    <Modal
      header={t('Change controller account')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('The stash account that is used. This will allow the controller to perform all non-funds related operations on behalf of the account.')}>
          <InputAddress
            isDisabled
            label={t('stash account')}
            value={stashId}
          />
        </Modal.Columns>
        {needsController && (
          <Modal.Columns hint={t('The selected controller tied to this stash. Once set, this account will be able to control the actions performed by the stash account.')}>
            <InputAddress
              defaultValue={defaultControllerId}
              label={t('controller account')}
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
        )}
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={stashId}
          icon='sign-in-alt'
          isDisabled={
            isFatal ||
            (
              needsController
                ? !controllerId
                : false
            )
          }
          label={t('Set controller')}
          onStart={onClose}
          params={
            needsController
              ? [controllerId]
              : []
          }
          tx={api.tx.staking.setController}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(SetControllerAccount);
