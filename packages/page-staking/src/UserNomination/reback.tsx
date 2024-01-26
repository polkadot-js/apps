// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { InputAddress, Modal, TxButton, Dropdown } from '@polkadot/react-components';
import { useTranslation } from '../translate';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { Available } from '@polkadot/react-query';
import { DropdownOptions } from '@polkadot/react-components/util/types';
import { TxCallback } from '@polkadot/react-components/Status/types';
import {useApi} from '@polkadot/react-hooks'

interface Props {
  account?: string;
  options?: KeyringSectionOption[];
  redeemOptions: object[];
  value?: string | null | undefined;
  onClose: () => void;
  onSuccess?: TxCallback
}

function ReBack({ account, onClose, options, redeemOptions, value, onSuccess }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [validatorId, setValidatorId] = useState<string | null | undefined>();
  const [amount, setAmount] = useState<string | undefined | number>();
  const [optionsId, setOptionsId] = useState<DropdownOptions>();
  const { api } = useApi()

  const transferrable = <span className='label'>{t('transferrable')}</span>;

  return (
    <Modal
      header={t('Unfreeze')}
      size='large'
      onClose={onClose}
    >
      <Modal.Content>
        <Modal.Columns>
          <InputAddress
            defaultValue={account}
            // help='The actual account you wish to reback account'
            isDisabled={!!account}
            label={t('Current Accounts')}
            labelExtra={
              <Available
                label={transferrable}
                params={account}
              />
            }
            type='account'
          />
          {/* <Modal.Column>
            <p>{t<string>('Redeem the current node')}</p>
          </Modal.Column> */}
        </Modal.Columns>

        <Modal.Columns>
          <InputAddress
            defaultValue={value}
            isDisabled={!!value}
            // help={t<string>('Redeem the current node')}
            hideAddress={true}
            label={t('Redeem the current node')}
            labelExtra={
              <span> </span>
            }
            onChange={(value) => {
              const filterOptions = redeemOptions.filter((item) => item.validatorId === value);
              const currentOptions: DropdownOptions = [];
              filterOptions.forEach((item, index) => {
                currentOptions.push(
                  {
                    text: item.text,
                    value: index + ''
                  }
                );
              });

              setOptionsId(currentOptions);

              setValidatorId(value);
            }}
            options={
              options
            }
            type='allPlus'
          />
          {/* <Modal.Column>
            <p>{t<string>('Redeem the current node')}</p>
          </Modal.Column> */}
        </Modal.Columns>
        <Modal.Columns>
          <Dropdown
            defaultValue={optionsId?.length > 0 ? optionsId[0].value : ''}
            // help={t<string>('Unfreeze ID')}
            label={t('Unfreeze ID')}
            onChange={setAmount}
            options={optionsId || []}
          />
          {/* <Modal.Column>
            <p>{t<string>('Unfreeze ID')} </p>
          </Modal.Column> */}
        </Modal.Columns>
      </Modal.Content>

      <Modal.Actions>
        <TxButton
          accountId={account}
          icon='sign-in-alt'
          label={t('Unfreeze')}
          onStart={onClose}
          params={[validatorId, amount]}
          onSuccess={onSuccess}
          tx={api.tx.xStaking.unlockUnbondedWithdrawal}

        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(ReBack);
