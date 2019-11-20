// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import { Button, InputAddress, TxButton, Available, Modal } from '@polkadot/react-components';
import styled from 'styled-components';
import { InputParameters } from '@polkadot/react-components';

import translate from './translate';
import { Parameters } from '@plasm/utils';
import { bool } from '@polkadot/types';
import { I18nProps } from '@polkadot/react-components/types';

interface Props extends I18nProps {
  className?: string;
  onClose: () => void;
  accountId?: string | null;
}

function UpdateParameters ({ className, onClose, accountId, t }: Props): React.ReactElement<Props> {
  const [operatorId, setOperatorId] = useState<string | null>(accountId || null);
  const [contractId, setContractId] = useState<string | null>(null);
  const [parameters, setParameters] = useState<any>(undefined);

  const transferrable = <span className='label'>{t('transferrable')}</span>;
  const convertParameters = (operateParameters?: any): Parameters => {
    if(!!!operateParameters) { return Parameters.default(); }
    const { canBeNominated, optionExpired, optionP } = operateParameters[0].value;
    const ops = new Parameters({
      canBeNominated: new bool(canBeNominated),
      optionExpired,
      optionP
    })
    console.log(ops)
    return ops
  }

  return (
    <Modal
      className='app--accounts-Modal'
      dimmer='inverted'
      open
    >
      <Modal.Header>{t('Update parameters')}</Modal.Header>
      <Modal.Content>
        <div className={className}>
          <InputAddress
            defaultValue={accountId}
            help={t('The opeartor account address')}
            isDisabled={!!accountId}
            label={t('operator')}
            labelExtra={<Available label={transferrable} params={accountId} />}
            onChange={setOperatorId}
            type='account'
          />
          <InputAddress
            label='contract address'
            onChange={setContractId}      
            type='contract'      
          />
          <InputParameters
            onChange={setParameters}            
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
            label={t('Make update parameters')}
            onStart={onClose}
            withSpinner={false}
            params={[contractId, convertParameters(parameters)]}
            tx='operator.updateParameters'
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(
    styled(UpdateParameters)`
      article.padded {
        box-shadow: none;
        margin-left: 2rem;
      }
  
      label.with-help {
        flex-basis: 10rem;
      }
    `
  );