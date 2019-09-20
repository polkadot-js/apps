// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { AddressCard, AddressInfo, Button, ChainLock, Forget, Icon } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';

import Transfer from '@polkadot/app-accounts/modals/Transfer';

import translate from './translate';

interface Props extends I18nProps {
  address: string;
  className?: string;
}

interface State {
  current?: KeyringAddress;
  genesisHash: string | null;
  isEditable: boolean;
  isForgetOpen: boolean;
  isTransferOpen: boolean;
}

const WITH_BALANCE = { available: true, free: true, total: true };
const WITH_EXTENDED = { nonce: true };

class Address extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    const { address } = this.props;
    const current = keyring.getAddress(address);

    this.state = {
      current,
      genesisHash: (current && current.meta.genesisHash) || null,
      isEditable: true,
      isForgetOpen: false,
      isTransferOpen: false
    };
  }

  public render (): React.ReactNode {
    const { address, className, t } = this.props;
    const { current, genesisHash, isEditable, isForgetOpen, isTransferOpen } = this.state;

    return (
      <AddressCard
        buttons={
          <div className='addresses--Address-buttons buttons'>
            <div className='actions'>
              {isEditable && (
                <Button
                  isNegative
                  onClick={this.toggleForget}
                  icon='trash'
                  key='forget'
                  size='small'
                  tooltip={t('Forget this address')}
                />
              )}
              <Button
                isPrimary
                key='deposit'
                label={<><Icon name='paper plane' /> {t('deposit')}</>}
                onClick={this.toggleTransfer}
                size='small'
                tooltip={t('Send funds to this address')}
              />
            </div>
            {isEditable && (
              <div className='others'>
                <ChainLock
                  genesisHash={genesisHash}
                  onChange={this.onGenesisChange}
                />
              </div>
            )}
          </div>
        }
        className={className}
        isEditable={isEditable}
        type='address'
        value={address}
        withExplorer
        withIndex
        withTags
      >
        {address && current && (
          <>
            {isForgetOpen && (
              <Forget
                address={current.address}
                onForget={this.onForget}
                key='modal-forget-account'
                mode='address'
                onClose={this.toggleForget}
              />
            )}
            {isTransferOpen && (
              <Transfer
                key='modal-transfer'
                onClose={this.toggleTransfer}
                recipientId={address}
              />
            )}
          </>
        )}
        <AddressInfo
          address={address}
          withBalance={WITH_BALANCE}
          withExtended={WITH_EXTENDED}
        />
      </AddressCard>
    );
  }

  private toggleForget = (): void => {
    this.setState(({ isForgetOpen }): Pick<State, never> => ({
      isForgetOpen: !isForgetOpen
    }));
  }

  private toggleTransfer = (): void => {
    this.setState(({ isTransferOpen }): Pick<State, never> => ({
      isTransferOpen: !isTransferOpen
    }));
  }

  private onForget = (): void => {
    const { address, t } = this.props;

    if (!address) {
      return;
    }

    const status: Partial<ActionStatus> = {
      account: address,
      action: 'forget'
    };

    try {
      keyring.forgetAddress(address);
      status.status = 'success';
      status.message = t('address forgotten');
    } catch (error) {
      status.status = 'error';
      status.message = error.message;
    }
  }

  private onGenesisChange = (genesisHash: string | null): void => {
    const { address } = this.props;

    this.setState({ genesisHash }, (): void => {
      const account = keyring.getAddress(address);

      account && keyring.saveAddress(address, { ...account.meta, genesisHash });
    });
  }
}

export default translate(
  styled(Address)`
    .addresses--Address-buttons {
      text-align: right;

      .others {
        margin-right: 0.125rem;
        margin-top: 0.25rem;
      }
    }
  `
);
