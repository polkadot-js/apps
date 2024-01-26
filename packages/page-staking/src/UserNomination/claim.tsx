// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useTranslation } from '../translate';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { TxCallback } from '@polkadot/react-components/Status/types';
import { useApi } from '@polkadot/react-hooks'

interface Props {
  account?: string;
  options?: KeyringSectionOption[];
  value?: string | null | undefined;
  onClose: () => void;
  onSuccess?: TxCallback
}

function Claim({ account, onClose, options, value, onSuccess }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [validatorId, setValidatorId] = useState<string | null | undefined>(value);
  const transferrable = <span className='label'>{t<string>('transferrable')}</span>;
  const { api } = useApi()

  return (
    <Modal
      header={t('Claim Interests')}
      size='large'
      onClose={onClose}
    >
      <Modal.Content>
        <Modal.Columns>
          <InputAddress
            defaultValue={account}
            // help='The actual account you wish to claim'
            isDisabled={!!account}
            label={t('My Account')}
            // labelExtra={
            //   <Available
            //     label={transferrable}
            //     params={account}
            //   />
            // }
            type='account'
          />
          {/* <Modal.Column>
            <p>{t<string>('Claim Interests')}</p>
          </Modal.Column> */}
        </Modal.Columns>

        <Modal.Columns>
          <InputAddress
            defaultValue={value}
            isDisabled={!!value}
            // help={t<string>('Current interest validator')}
            hideAddress={true}
            label={t('Current interest validator')}
            labelExtra={
              <span> </span>
            }
            value={value}
            type='allPlus'
          />
          {/* <Modal.Column>
            <p>{t<string>('Current interest validator')}</p>
          </Modal.Column> */}
        </Modal.Columns>
      </Modal.Content>

      <Modal.Actions>
        <TxButton
          accountId={account}
          icon='sign-in-alt'
          label={t('Claim')}
          onStart={onClose}
          params={[validatorId]}
          tx={api.tx.xStaking.claim}
          onSuccess={onSuccess}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Claim);
