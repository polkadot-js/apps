// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState } from 'react';
import {Available, InputAddress, InputBalance, Modal, TxButton} from '@polkadot/react-components';
import { useTranslation } from '../translate';
import { TxCallback } from '@polkadot/react-components/Status/types';
import styled from 'styled-components';
import {useApi} from '@polkadot/react-hooks'

interface Props {
  validatorId: string | null | undefined;
  onClose: () => void;
  onSuccess?: TxCallback;
  remainingVotesData: string | undefined;
}

const VoteData = styled.span`
  > span.warning{
    color: red;
  }
`

function Voter({ onClose, validatorId, onSuccess, remainingVotesData }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi()
  const [amount, setAmount] = useState<BN | undefined>();
  const [accountId, setAccount] = useState<string | null | undefined>();
  const voteable = <span className='label'>{t('voteable')}</span>;
  const remainingVotes = (<VoteData className='label'>
    {t('Remaining Votes')}
    {'： '}
    {remainingVotesData && Number(remainingVotesData) > 0 ? <span> {remainingVotesData}</span> :<span className='warning'>0</span>}
    {'  GEB'}
  </VoteData>)

  return (
    <Modal
      header={t('Vote')}
      size='large'
      onClose={onClose}
    >
      <Modal.Content>
        <Modal.Columns>
          <InputAddress
            label={t('My Account')}
            labelExtra={
              <Available
                label={voteable}
                params={accountId}
              />
            }
            onChange={setAccount}
            type='account'
          />
        </Modal.Columns>

        <Modal.Columns>
          <InputAddress
            defaultValue={validatorId}
            label={t('Vote For Validator')}
            labelExtra={remainingVotes}
            type='allPlus'
            isDisabled={!!validatorId}
          />
        </Modal.Columns>

        <Modal.Columns>
          <InputBalance
            autoFocus
            label={t('Vote Amount')}
            onChange={setAmount}
          />
        </Modal.Columns>

      </Modal.Content>

      <Modal.Actions>
        <TxButton
          accountId={accountId}
          icon='sign-in-alt'
          label={t('Vote')}
          onStart={onClose}
          params={[validatorId, amount]}
          tx={api.tx.xStaking.bond}
          onSuccess={onSuccess}
          isDisabled={Number(remainingVotesData) <= 0}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Voter);
