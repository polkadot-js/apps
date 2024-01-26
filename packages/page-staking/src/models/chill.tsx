// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useTranslation } from '../translate';
import { Available } from '@polkadot/react-query';
import { TxCallback } from '@polkadot/react-components/Status/types';
import {useApi} from '@polkadot/react-hooks'


interface Props {
  onClose: () => void;
  validatorId: string | undefined;
  onSuccess?: TxCallback;
}

function Chill({ onClose, validatorId, onSuccess }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [accountId, setAccount] = useState<string | null | undefined>();
  const transferrable = <span className='label'>{t<string>('transferrable')}</span>;
  const { api } = useApi()

  return (
    <Modal
      header={t('Node Drop')}
      size='large'
      onClose={onClose}
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Columns>
            <InputAddress
              label={t('Drop Account')}
              labelExtra={
                <Available
                  label={transferrable}
                />
              }
              onChange={setAccount}
              type='account'
            />
          </Modal.Columns>
          <Modal.Columns>
            <p>{t('Drop this node')}</p>
          </Modal.Columns>
        </Modal.Columns>
        {/* <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={validatorId}
              help='The validator acount you want to Drop'
              isDisabled={!!validatorId}
              label='Validator account'
              labelExtra={
                <Available
                  label={transferrable}
                  params={validatorId}
                />
              }
              type='account'
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Drop this node')}</p>
          </Modal.Column>
        </Modal.Columns> */}

      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={accountId}
          icon='sign-in-alt'
          label={t('Drop')}
          onStart={onClose}
          params={[]}
          tx={api.tx.xStaking.chill}
          onSuccess={() => {
            onSuccess?.()
          }}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Chill);
