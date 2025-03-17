// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState } from 'react';
import {InputAddress, InputBalance, Modal, TxButton} from '@polkadot/react-components';
import { useTranslation } from '../translate.js';
import { TxCallback } from '@polkadot/react-components/Status/types';

import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import {Available, FormatBalance} from '@polkadot/react-query';
import {useApi} from '@polkadot/react-hooks'

interface Props {
  account?: string;
  options?: KeyringSectionOption[];
  value?: string | null | undefined;
  onClose: () => void;
  onSuccess?: TxCallback;
  remainingVotesData?: string;
}

function VoteNode({ account, onClose, options, value, onSuccess, remainingVotesData }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [validatorId, setValidatorId] = useState<string | null | undefined>();
  const [amount, setAmount] = useState<BN | undefined>();
  const { api } = useApi()

  const transferrable = <span className='label'>{t('voteable')}</span>;

  return (
    <Modal
      header={('Vote')}
      size='large'
      onClose={onClose}
    >
      <Modal.Content>
        <Modal.Columns>
          <InputAddress
            defaultValue={account}
            // isDisabled={!!account}
            isDisabled
            label={t('My Account')}
            labelExtra={
              <Available
                label={transferrable}
                params={account}
              />
            }
            type='account'
          />
        </Modal.Columns>

        <Modal.Columns>
          <InputAddress
            defaultValue={value}
            isDisabled={!!value}
            hideAddress={true}
            label={t('Vote for validator')}
            labelExtra={value?.toLowerCase() !== account?.toLowerCase() && (
              <span className="label">
                {t('Remaining Votes')}
                {'： '}
                {remainingVotesData && Number(remainingVotesData) > 0 ? <span> {remainingVotesData}</span> :
                  <span style={{color: 'red'}}>0</span>}
                {'  GEB'}
              </span>
            )}
            onChange={setValidatorId}
            options={
              options
            }
            type="allPlus"
          />
        </Modal.Columns>

        <Modal.Columns>
          <InputBalance
            autoFocus
            // help={t<string>('Vote Amount')}
            label={t('Vote Amount')}
            onChange={setAmount}
          />
          {/* <Modal.Column>
            <p>{t<string>('Vote Amount')}</p>
          </Modal.Column> */}
        </Modal.Columns>
      </Modal.Content>

      <Modal.Actions >
        <TxButton
          accountId={account}
          icon='sign-in-alt'
          label={t('Vote')}
          onStart={onClose}
          params={[validatorId, amount]}
          tx={api.tx.xStaking.bond}
          onSuccess={onSuccess}

        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(VoteNode);
