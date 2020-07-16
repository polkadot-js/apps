// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { AccountId, ProxyType } from '@polkadot/types/interfaces';
import { AmountValidateState } from '../types';

import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import { Button, InputAddress, Modal, TxButton, Dropdown } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';
import ValidateAmount from './InputValidateAmount';
import styled from 'styled-components';

interface Props {
  proxiedAccount: string;
  className?: string;
  onClose: () => void;
  previousAmount?: BN;
  previousDelegatingAccount?: string;
  previousProxy?: [[AccountId, ProxyType][], BN];
}

function createExtrinsic (api: ApiPromise, batch: any[]): SubmittableExtrinsic<'promise'> | null {
  if (batch.length === 1) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return batch[0];
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return api.tx.utility.batch(batch);
}

function ProxyOverview ({ className, onClose, previousAmount, previousDelegatingAccount, previousProxy, proxiedAccount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amountError, setAmountError] = useState<AmountValidateState | null>(null);
  const [amount, setAmount] = useState<BN | undefined>(previousAmount);
  const [delegatingAccount, setDelegatingAccount] = useState<string | null>(previousDelegatingAccount || null);
  const [batchStack, setBatchStack] = useState<any[]>([]);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [previousProxyAccountsTypes, _] = previousProxy || [];
  const [previousProxyDisplay, setPreviousProxyDisplay] = useState<[AccountId, ProxyType][] | undefined>(previousProxyAccountsTypes);
  const [addedProxies, setAddedProxies] = useState<[AccountId, ProxyType][] | undefined>(undefined);

  console.log('batchstack', batchStack.length);
  console.log('extrinsic', extrinsic);
  useEffect(() => {
    if (batchStack.length) {
      setExtrinsic(createExtrinsic(api, batchStack));
    }
  }, [api, batchStack]);

  const typeOpts = [
    { text: 'Any', value: 0 },
    { text: 'NonTransfer', value: 1 },
    { text: 'Governance', value: 2 },
    { text: 'Staking', value: 3 },
    { text: 'IdentityJudgment', value: 4 }
  ];

  console.log('previousProxy', previousProxy?.toString());

  return (
    <Modal
      className={className}
      header={t<string>('Proxy overview')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              isDisabled={true}
              label={t<string>('account')}
              type='account'
              value={proxiedAccount}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Any account set as proxy will be able to perform actions in place of the proxied account')}</p>
            <p>{t<string>('If you add several proxy accounts for the same proxy type (e.g 2 accounts set as proxy for Governance), then any of those account set as proxy will be able to perfom governance actions')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            {previousProxyDisplay?.length && previousProxyDisplay.map(([account, type], index) => {
              return (
                <div
                  className='proxy-container'
                  key={`${proxiedAccount}-${account.toString()}-${type.toString()}`}
                >
                  <div className='input-column'>
                    <InputAddress
                      isDisabled={true}
                      key={`account-${index}`}
                      label={t<string>('proxy account')}
                      type='account'
                      value={account.toString()}
                    />
                    <Dropdown
                      help={'Type of proxy'}
                      isDisabled={true}
                      label={'type'}
                      options={typeOpts}
                      value={type.toNumber()}
                    />
                  </div>
                  <div className='buttons-column'>
                    <Button
                      icon='times'
                      isNegative
                      key='close'
                      onClick={() => {
                        console.log('index', index);
                        // console.log('[...previousProxyDisplay.splice(index, 1)]', previousProxyDisplay.filter(([a, bn], i) => i !== index));
                        setPreviousProxyDisplay(previousProxyDisplay.filter(([a, bn], i) => i !== index));
                        setBatchStack(batchStack.concat(
                          api.tx.proxy.removeProxy(account, type)
                        ));
                      }
                      }
                    />
                  </div>
                </div>
              );
            })}
            {addedProxies?.length && addedProxies.map(([account, type], index) => {
              return (
                <div
                  className='proxy-container'
                  key={`${proxiedAccount}-${account.toString()}-${type.toString()}`}
                >
                  <div className='input-column'>
                    <InputAddress
                      key={`account-${index}`}
                      label={t<string>('proxy account')}
                      type='account'
                      value={account.toString()}
                    />
                    <Dropdown
                      help={'Type of proxy'}
                      label={'type'}
                      options={typeOpts}
                      value={type.toNumber()}
                    />
                  </div>
                  <div className='buttons-column'>
                    <Button
                      icon='times'
                      isNegative
                      key='close'
                      onClick={() => {
                        console.log('index', index);
                        // console.log('[...previousProxyDisplay.splice(index, 1)]', previousProxyDisplay.filter(([a, bn], i) => i !== index));
                        setPreviousProxyDisplay(addedProxies.filter(([a, bn], i) => i !== index));
                        setBatchStack(batchStack.concat(
                          api.tx.proxy.removeProxy(account, type)
                        ));
                      }
                      }
                    />
                  </div>
                </div>);
            })}
            <div className='buttons-add'>
              <Button
                icon='plus'
                isNegative
                key='add'
                onClick={() => {
                  console.log('index');
                }}
              />
            </div>
          </Modal.Column>
          <Modal.Column>
            <p>{t('')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={proxiedAccount}
          icon='trash-alt'
          isNegative
          label={t<string>('Remove all proxies')}
          onStart={onClose}
          params={[]}
          tx='proxy.removeProxies'
        />
        <TxButton
          accountId={proxiedAccount}
          extrinsic={extrinsic}
          icon='sign-in-alt'
          isDisabled={!batchStack.length}
          isPrimary
          label={t<string>('Save')}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(ProxyOverview)`
  .proxy-container{
    display: grid;
    grid-column-gap: 0.5rem;
    margin-bottom: 1rem;
    
    .input-column{
      grid-column: 1;
    }
    .buttons-column{
      grid-column: 2;
      padding-top: 0.3rem;
    }
  }
`);
