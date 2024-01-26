// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState } from 'react';
import {Input, InputAddress, InputBalance, Modal, Row, TxButton} from '@polkadot/react-components';
import { useTranslation } from '../translate';
import { Available } from '@polkadot/react-query';
import { TxCallback } from '@polkadot/react-components/Status/types';
import { useApi } from '@polkadot/react-hooks';

interface Props {
  nodeslist?: string[],
  onClose: () => void;
  onSuccess?: TxCallback;
}

function RegisterNewNode({ nodeslist, onClose, onSuccess }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [nodeName, setNodeName] = useState<string | null | undefined>();
  const [amount, setAmount] = useState<BN | undefined>();
  const [accountId, setAccount] = useState<string | null | undefined>();
  const transferrable = <span className='label'>{t('transferrable')}</span>;
  const { api } = useApi()

  return (
    <Modal
      header={t('Register new node')}
      size='large'
      onClose={onClose}
    >
      <Modal.Content>
        <Modal.Columns>
          <InputAddress
            label={t('Register Account')}
            labelExtra={
              <Available
                label={transferrable}
                params={accountId}
              />
            }
            onChange={setAccount}
            type='account'
          />
          {/*<p>{t('Register new node')}</p>*/}
        </Modal.Columns>
        <Modal.Columns>
          <Input
            label={t('Unique, within 12 characters, make sure not repeated')}
            onChange={setNodeName}
            type='text'
          />
          {/*<p>{t('Unique and unchangeable, non-transferable after registration')}</p>*/}
        </Modal.Columns>

        <Modal.Columns>
          <InputBalance
            autoFocus
            label={t('Number of node mortgages')}
            onChange={setAmount}
          />
          {/*<p>{t('Number of node mortgages')}</p>*/}
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={accountId}
          icon='sign-in-alt'
          label={t('Register')}
          onStart={onClose}
          onSuccess={onSuccess}
          params={[nodeName, amount]}
          tx={api.tx.xStaking.register}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(RegisterNewNode);
