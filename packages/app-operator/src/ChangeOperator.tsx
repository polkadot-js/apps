// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useState } from 'react';
import { Button, InputAddress, TxButton, Available, InputContractList } from '@polkadot/react-components';
import styled from 'styled-components';

import Summary from './Summary';
import translate from './translate';

interface Props {
  accountId?: string | null;
}

 function ChangeOperator ({ accountId, t }: Props): React.ReactElement<Props> {
    console.log('in change operator 1')
    const [operatorId, setOperatorId] = useState<string | null>(accountId || null);
    const [contractList, setContractList] = useState(false);
    const [recipientId, setRecipientId] = useState(false);
    console.log('in change operator 2')

    const transferrable = <span className='label'>{t('transferrable')}</span>;

  return (
    <section>
      <h1>change operator</h1>
      <div className='ui--row'>
        <div className='large'>
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
            label='contract address list'
            onChange={setContractList}
            type='all'
          />
          <InputAddress
            help={t('Select a the operatord address you want to change to.')}
            label={t('operate to address')}
            labelExtra={<Available label={transferrable} params={recipientId} />}
            onChange={setRecipientId}
            type='allPlus'
          />
          <Button.Group>
            <TxButton
              accountId={operatorId}
              icon='send'
              label='make change operator'
              params={[contractList, recipientId]}
              tx='operator.changeOperator'
            />
          </Button.Group>
        </div>
        <Summary className='small'>Make a change operator from any account you control to another account. ChangeOperator fees and per-transaction fees apply and will be calculated upon submission.</Summary>
      </div>
    </section>
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
  