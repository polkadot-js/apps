// Copyright 2017-2023 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { Option } from '@polkadot/types';
import type { ProxyDefinition, RecoveryConfig } from '@polkadot/types/interfaces';
import type { KeyringAddress } from '@polkadot/ui-keyring/types';
import type { AccountBalance, Delegation } from '../types';

import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { AddressSmall, Badge, Button, Forget, Icon, Tags } from '@polkadot/react-components';
import { useAccountInfo, useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { BN, formatBalance, formatNumber, isFunction } from '@polkadot/util';

import DelegateModal from '../modals/Delegate';
import UndelegateModal from '../modals/Undelegate';
import { useTranslation } from '../translate';

interface Props {
  account: KeyringAddress;
  className?: string;
  delegation?: Delegation;
  filter: string;
  isFavorite: boolean;
  proxy?: [ProxyDefinition[], BN];
  setBalance: (address: string, value: AccountBalance) => void;
  toggleFavorite: (address: string) => void;
}

function calcVisible (filter: string, name: string, tags: string[]): boolean {
  if (filter.length === 0) {
    return true;
  }

  const _filter = filter.toLowerCase();

  return tags.reduce((result: boolean, tag: string): boolean => {
    return result || tag.toLowerCase().includes(_filter);
  }, name.toLowerCase().includes(_filter));
}

const transformRecovery = {
  transform: (opt: Option<RecoveryConfig>) => opt.unwrapOr(null)
};

function Account ({ account: { address, meta }, className = '', delegation, filter, isFavorite, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [isExpanded] = useToggle(false);
  const api = useApi();
  const recoveryInfo = useCall<RecoveryConfig | null>(api.api.query.recovery?.recoverable, [address], transformRecovery);
  const { flags: { isDevelopment }, name: accName, tags } = useAccountInfo(address);
  const [isForgetOpen, toggleForget] = useToggle();
  const [isDelegateOpen, toggleDelegate] = useToggle();
  const [isUndelegateOpen, toggleUndelegate] = useToggle();

  const isVisible = useMemo(
    () => calcVisible(filter, accName, tags),
    [accName, filter, tags]
  );

  const _onFavorite = useCallback(
    () => toggleFavorite(address),
    [address, toggleFavorite]
  );

  const _onForget = useCallback(
    (): void => {
      if (!address) {
        return;
      }

      const status: Partial<ActionStatus> = {
        account: address,
        action: 'forget'
      };

      try {
        keyring.forgetAccount(address);
        status.status = 'success';
        status.message = t<string>('account forgotten');
      } catch (error) {
        status.status = 'error';
        status.message = (error as Error).message;
      }
    },
    [address, t]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {delegation?.accountDelegated && (
        <div>
          <tr className={`${className}${isExpanded ? ' noBorder' : ''}`}>
            <td className='favorite'>
              <Icon
                color={isFavorite ? 'orange' : 'gray'}
                icon='star'
                onClick={_onFavorite}
              />
            </td>
            <td className='together'>
              <div className='badges'>
                <div className='info'>
                  {meta.genesisHash
                    ? <Badge color='transparent' />
                    : isDevelopment
                      ? (
                        <Badge
                          className='warning'
                          hover={t<string>('This is a development account derived from the known development seed. Do not use for any funds on a non-development network.')}
                          icon='wrench'
                        />
                      )
                      : (
                        <Badge
                          className='warning'
                          hover={
                            <div>
                              <p>{t<string>('This account is available on all networks. It is recommended to link to a specific network via the account options ("only this network" option) to limit availability. For accounts from an extension, set the network on the extension.')}</p>
                              <p>{t<string>('This does not send any transaction, rather it only sets the genesis in the account JSON.')}</p>
                            </div>
                          }
                          icon='exclamation-triangle'
                        />
                      )
                  }
                  {recoveryInfo && (
                    <Badge
                      className='recovery'
                      hover={
                        <div>
                          <p>{t<string>('This account is recoverable, with the following friends:')}</p>
                          <div>
                            {recoveryInfo.friends.map((friend, index): React.ReactNode => (
                              <AddressSmall
                                key={index}
                                value={friend}
                              />
                            ))}
                          </div>
                          <table>
                            <tbody>
                              <tr>
                                <td>{t<string>('threshold')}</td>
                                <td>{formatNumber(recoveryInfo.threshold)}</td>
                              </tr>
                              <tr>
                                <td>{t<string>('delay')}</td>
                                <td>{formatNumber(recoveryInfo.delayPeriod)}</td>
                              </tr>
                              <tr>
                                <td>{t<string>('deposit')}</td>
                                <td>{formatBalance(recoveryInfo.deposit)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      }
                      icon='redo'
                    />
                  )}
                </div>
                <div className='action'>
                  {delegation?.accountDelegated && (
                    <Badge
                      className='information'
                      hover={t<string>('This account has a governance delegation')}
                      hoverAction={t<string>('Manage delegation')}
                      icon='calendar-check'
                      onClick={toggleDelegate}
                    />
                  )}
                </div>
              </div>
            </td>
            <td className='address'>
              <AddressSmall
                parentAddress={meta.parentAddress}
                value={delegation?.accountDelegated}
                withShortAddress
              />
              {isDelegateOpen && (
                <DelegateModal
                  key='modal-delegate'
                  onClose={toggleDelegate}
                  previousAmount={delegation?.amount}
                  previousConviction={delegation?.conviction}
                  previousDelegatedAccount={delegation?.accountDelegated}
                  previousDelegatingAccount={address}
                />
              )}
              {isForgetOpen && (
                <Forget
                  address={address}
                  key='modal-forget-account'
                  onClose={toggleForget}
                  onForget={_onForget}
                />
              )}
              {isUndelegateOpen && (
                <UndelegateModal
                  accountDelegating={address}
                  key='modal-delegate'
                  onClose={toggleUndelegate}
                />
              )}
            </td>
            {delegation?.accountDelegated && (
              <td className='button'>
                {isFunction(api.api.tx.balances?.transfer) && (
                  <Button
                    icon='stop'
                    label={t<string>('Undelegate')}
                    onClick={toggleUndelegate}
                  />
                )}
              </td>
            )}
          </tr>
          <tr className={`${className} ${isExpanded ? 'isExpanded' : 'isCollapsed'}`}>
            <td colSpan={2} />
            <td>
              <div
                className='tags'
                data-testid='tags'
              >
                <Tags
                  value={tags}
                  withTitle
                />
              </div>
            </td>
            <td className='media--1500' />
            <td />
            <td colSpan={2} />
          </tr>
        </div>
      )}
    </>
  );
}

export default React.memo(styled(Account)`
  &.isCollapsed {
    visibility: collapse;
  }

  &.isExpanded {
    visibility: visible;
  }

  .tags {
    width: 100%;
    min-height: 1.5rem;
  }

  .devBadge {
    opacity: 0.65;
  }

  && td.button {
    padding-bottom: 0.5rem;
  }

  && td.fast-actions {
    padding-left: 0.2rem;
    padding-right: 1rem;
    width: 1%;

    .fast-actions-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      & > * + * {
        margin-left: 0.35rem;
      }

      .send-button {
        min-width: 6.5rem;
      }
    }
  }

  && .ui--AddressInfo .ui--FormatBalance,
  && .ui--AddressInfo .result {
    .ui--Icon, .icon-void {
      margin-left: 0.7rem;
      margin-right: 0.3rem;
    }

    .ui--Button.isIcon {
      margin-left: 0.5rem;
      padding: 0.15rem 0.2rem 0.05rem;
      border: 1px solid var(--border-table);
      border-radius: 4px;

      .ui--Icon {
        padding: 0;
        margin: 0;
      }
    }
  }

  .together > .badges {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    & > .info + .action {
      margin-top: 0.5rem;

      &:empty {
        margin-top: 0;
      }
    }

    & > .info:empty + .action {
      margin-top: 0;
    }
  }
`);
