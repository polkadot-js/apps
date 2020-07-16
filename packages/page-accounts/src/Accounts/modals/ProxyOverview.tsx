// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { AccountId, ProxyType } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import { registry } from '@polkadot/react-api';
import { Button, InputAddress, Modal, TxButton, Dropdown } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import styled from 'styled-components';

interface Props {
  className?: string;
  onClose: () => void;
  previousProxy?: [[AccountId, ProxyType][], BN];
  proxiedAccount: string;
}

function createExtrinsic (api: ApiPromise, batchPrevious: any[], batchAdded: any[]): SubmittableExtrinsic<'promise'> | null {
  if (batchPrevious.length + batchAdded.length === 1) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return batchPrevious.length
      ? batchPrevious[0]
      : batchAdded[0];
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return api.tx.utility.batch([...batchPrevious, ...batchAdded]);
}

function ProxyOverview ({ className, onClose, previousProxy, proxiedAccount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  // the stack of extrinsics on the previous proxies
  const [batchStackPrevious, setBatchStackPrevious] = useState<any[]>([]);
  // the stack of extrinsics on newly added proxies
  const [batchStackAdded, setBatchStackAdded] = useState<any[]>([]);
  // the final extrinsic (either single or a batch)
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  // list of previous accounts and proxy types
  const [previousProxyAccountsTypes, _] = previousProxy || [];
  // actualized list of previous proxy including new changes (deletion if any)
  const [previousProxyDisplay, setPreviousProxyDisplay] = useState<[AccountId, ProxyType][] | undefined>(previousProxyAccountsTypes);
  // actualized list of new proxies (additions, if any)
  const [addedProxies, setAddedProxies] = useState<[AccountId, ProxyType][]>([]);

  console.log('batchStackPrevious', batchStackPrevious);
  console.log('batchStackAdded', batchStackAdded);

  useEffect(() => {
    if (batchStackPrevious.length || batchStackAdded.length) {
      console.log('set extrinsics...');
      setExtrinsic(createExtrinsic(api, batchStackPrevious, batchStackAdded));
    }
  }, [api, batchStackPrevious, batchStackAdded]);

  const typeOpts = [
    { text: 'Any', value: 0 },
    { text: 'NonTransfer', value: 1 },
    { text: 'Governance', value: 2 },
    { text: 'Staking', value: 3 },
    { text: 'IdentityJudgment', value: 4 }
  ];

  console.log('previousProxy', previousProxy?.toString());

  const addProxy = () => {
    const newAccount = registry.createType('AccountId', proxiedAccount);
    const newType = registry.createType('ProxyType', 0);

    setAddedProxies((prevState) => {
      const newProxy: [AccountId, ProxyType] = [newAccount, newType];

      if (!prevState) {
        return [newProxy];
      }

      const newState: [AccountId, ProxyType][] = [...prevState, newProxy];

      return newState;
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    setBatchStackAdded((prev) => prev.concat(
      api.tx.proxy.addProxy(newAccount, newType)
    ));
  };

  const changeAddedProxyAccount = (accountString: string | null, index: number) => {
    setAddedProxies((prevState) => {
      if (!prevState || !accountString) {
        console.error('oops previous state is undefined or selected account is null');

        return prevState;
      }

      prevState[index][0] = registry.createType('AccountId', accountString);

      return prevState;
    });
  };

  const changeAddedProxyType = (newType: ProxyType | null, index: number) => {
    setAddedProxies((prevState) => {
      if (!prevState || !newType) {
        console.error('oops previous state is undefined or selected account is null');

        return prevState;
      }

      prevState[index][1] = newType;

      return prevState;
    });
  };

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
            {!!previousProxyDisplay?.length && previousProxyDisplay.map(([account, type], index) => {
              return (
                <div
                  className='proxy-container'
                  key={`previousPoxy-${index}`}
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
                        setBatchStackPrevious(batchStackPrevious.concat(
                          api.tx.proxy.removeProxy(account, type)
                        ));
                      }
                      }
                    />
                  </div>
                </div>
              );
            })}
            {!!addedProxies?.length && addedProxies.map(([account, type], index) => {
              return (
                <div
                  className='proxy-container'
                  key={`addedProxy-${index}`}
                >
                  <div className='input-column'>
                    <InputAddress
                      label={t<string>('proxy account')}
                      onChange={(value: string | null) => changeAddedProxyAccount(value, index)}
                      type='account'
                      value={account.toString()}
                    />
                    <Dropdown
                      help={'Type of proxy'}
                      label={'type'}
                      onChange={(value: ProxyType | null) => changeAddedProxyType(value, index)}
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
                        setAddedProxies(addedProxies.filter(([a, bn], i) => i !== index));
                        setBatchStackAdded(batchStackAdded.filter((e, i) => i !== index));
                      }}
                    />
                  </div>
                </div>);
            })}
            <div className='buttons-add'>
              <Button
                icon='plus'
                isNegative
                key='add'
                onClick={addProxy}
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
          isDisabled={!batchStackPrevious.length && !batchStackAdded.length}
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
