// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import { Button, InputAddress, TxButton, Available, InputContractList, Modal } from '@polkadot/react-components';
import styled from 'styled-components';
import { I18nProps } from '@polkadot/react-components/types';

import translate from './translate';

interface Props extends I18nProps {
  className?: string;
  onClose: () => void;
  accountId?: string | null;
}

function ChangeOperator ({ className, onClose, accountId, t }: Props): React.ReactElement<Props> {
  const [operatorId, setOperatorId] = useState<string | null>(accountId || null);
  const [contractList, setContractList] = useState<any[]>([]);
  const [recipientId, setRecipientId] = useState<string | null>(null);

  const transferrable = <span className='label'>{t('transferrable')}</span>;

  return (
    <Modal
      className='app--accounts-Modal'
      dimmer='inverted'
      open
    >
      <Modal.Header>{t('Change operator')}</Modal.Header>
      <Modal.Content>
        <div className={className}>
          <InputAddress
            defaultValue={accountId}
            help={t('The opeartor account address you will change.')}
            isDisabled={!!accountId}
            label={t('change from operator')}
            labelExtra={<Available label={transferrable} params={accountId} />}
            onChange={setOperatorId}
            type='account'
          />
          <InputContractList
            onChange={setContractList}
          />
          <InputAddress
            help={t('Select a the operator address you want to change to.')}
            label={t('new operator address')}
            labelExtra={<Available label={transferrable} params={recipientId} />}
            onChange={setRecipientId}
            type='account'
          />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            icon='cancel'
            isNegative
            label={t('Cancel')}
            onClick={onClose}
          />
          <Button.Or />
          <TxButton
            accountId={operatorId}
            icon='send'
            isPrimary
            label={t('Make change operator')}
            onStart={onClose}
            withSpinner={false}
            params={[contractList[0]?contractList[0].value:[], recipientId]}
            tx='operator.changeOperator'
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(
    styled(ChangeOperator)`
      article.padded {
        box-shadow: none;
        margin-left: 2rem;
      }
  
      label.with-help {
        flex-basis: 10rem;
      }
    `
  );