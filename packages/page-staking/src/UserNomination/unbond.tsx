// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState } from 'react';
import {InputAddress, InputBalance, Modal, TxButton} from '@polkadot/react-components';
import { useTranslation } from '../translate';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { FormatBalance } from '@polkadot/react-query';
import { TxCallback } from '@polkadot/react-components/Status/types';
import {useApi} from '@polkadot/react-hooks'

interface Props {
  account?: string;
  options?: KeyringSectionOption[];
  value?: string | null | undefined;
  onClose: () => void;
  onSuccess?: TxCallback;
  unamount?:  string | null | undefined;
}

function UnBond({ account, onClose, options, value, onSuccess, unamount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [validatorId, setValidatorId] = useState<string | null | undefined>();
  const [amount, setAmount] = useState<BN | undefined>();
  const { api } = useApi()

  const transferrable = <div>
    <span className='label web3ComingChat' style={{
      marginRight: "8px"
    }}>{t('The amount of ticket revocable')}</span>
    <FormatBalance value={unamount}></FormatBalance>
  </div>;

  return (
    <Modal
      header={t('Unbind')}
      size='large'
      onClose={onClose}
    >
      <Modal.Content>
        <Modal.Columns>
          <InputAddress
            defaultValue={account}
            // help='The actual account you wish to UnBound account'
            isDisabled={!!account}
            label={t('My Account')}
            labelExtra={transferrable}
            type='account'
          />
          {/* <Modal.Column>
            <p></p>
          </Modal.Column> */}
        </Modal.Columns>

        <Modal.Columns>
          <InputAddress
            defaultValue={value}
            isDisabled={!!value}
            value={value}

            // help={t<string>('UnBound for validator')}
            hideAddress={true}
            label={t('Unbind for validator')}
            labelExtra={
              <span> </span>
            }
            onChange={setValidatorId}
            options={
              options
            }
            type='allPlus'
          />
          {/* <Modal.Column>
            <p>{t<string>('UnBound Validator')}</p>
          </Modal.Column> */}
        </Modal.Columns>

        <Modal.Columns>
          <InputBalance
            autoFocus
            // help={t<string>('Unbind Amount')}
            label={t('Unbind Amount')}
            onChange={setAmount}
          />
          {/* <Modal.Column>
            <p>{t<string>('Unbind Amount')}</p>
          </Modal.Column> */}
        </Modal.Columns>
      </Modal.Content>

      <Modal.Actions>
        <TxButton
          accountId={account}
          icon='sign-in-alt'
          label={t('Unbind')}
          onStart={onClose}
          params={[validatorId, amount]}
          onSuccess={onSuccess}
          tx={api.tx.xStaking.unbond}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(UnBond);
