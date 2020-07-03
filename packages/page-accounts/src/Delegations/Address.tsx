// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// import { DeriveAccountInfo, DeriveBalancesAll } from '@polkadot/api-derive/types';
// import { ActionStatus } from '@polkadot/react-components/Status/types';
import { AccountId, Balance, Conviction } from '@polkadot/types/interfaces';
import { KeyringAddress } from '@polkadot/ui-keyring/types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddressSmall, Button, Icon, LinkExternal, Menu, Popup } from '@polkadot/react-components';
// import { useApi, useCall } from '@polkadot/react-hooks';
// import keyring from '@polkadot/ui-keyring';

import Delegate from './modals/Delegate';
import { useTranslation } from '../translate';
import { FormatBalance } from '@polkadot/react-query';
import Undelegate from './modals/Undelegate';

interface Props {
  accountDelegated: AccountId
  accountDelegating: KeyringAddress
  amount: Balance
  className?: string;
  conviction: Conviction
  isFavorite: boolean;
  toggleFavorite: (address: string) => void;
}

function Address ({ accountDelegated, accountDelegating, amount, className = '', conviction, isFavorite, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [current, setCurrent] = useState<KeyringAddress | null>(null);
  const [isSettingPopupOpen, setIsSettingPopupOpen] = useState(false);
  const [isDelegateOpen, setIsDelegateOpen] = useState(false);
  const [isUndelegateOpen, setIsUndelegateOpen] = useState(false);

  useEffect((): void => {
    const current = accountDelegating;

    setCurrent(current || null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _onFavorite = useCallback(
    (): void => toggleFavorite(accountDelegating.address),
    [accountDelegating, toggleFavorite]
  );

  const _toggleSettingPopup = useCallback(
    (): void => setIsSettingPopupOpen(!isSettingPopupOpen),
    [isSettingPopupOpen]
  );

  const _toggleUndelegate = useCallback(
    (): void => setIsUndelegateOpen(!isUndelegateOpen),
    [isUndelegateOpen]
  );

  const _toggleDelegate = useCallback(
    (): void => setIsDelegateOpen(!isDelegateOpen),
    [isDelegateOpen]
  );

  return (
    <tr className={className}>
      <td className='favorite'>
        <Icon
          color={isFavorite ? 'orange' : 'gray'}
          icon='star'
          onClick={_onFavorite}
        />
      </td>
      <td className='address'>
        <AddressSmall value={accountDelegating.address} />
        {accountDelegating && current && (
          <>
            {isDelegateOpen && (
              <Delegate
                amount={amount}
                conviction={conviction}
                delegatedAccount={accountDelegated}
                delegatingAccount={accountDelegating}
                key='modal-delegate'
                onClose={_toggleDelegate}
              />
            )}
            {isUndelegateOpen && (
              <Undelegate
                accountDelegating={accountDelegating.address}
                key='modal-delegate'
                onClose={_toggleUndelegate}
              />
            )}
          </>
        )}
      </td>
      <td className='address'>
        <AddressSmall value={accountDelegated} />
      </td>
      <td className='number'>
        <FormatBalance
          value={amount}
        />
      </td>
      <td className='all'>
        {conviction.toString()}
      </td>
      <td className='button'>
        <Button
          icon='trash'
          key='undelegate'
          label={t<string>('undelegate')}
          onClick={_toggleUndelegate}
        />
        <Popup
          className='theme--default'
          isOpen={isSettingPopupOpen}
          onClose={_toggleSettingPopup}
          trigger={
            <Button
              icon='ellipsis-v'
              onClick={_toggleSettingPopup}
            />
          }
        >
          <Menu
            onClick={_toggleSettingPopup}
            text
            vertical
          >
            <Menu.Item
              onClick={_toggleDelegate}
            >
              {t<string>('Change this delegation')}
            </Menu.Item>
          </Menu>
        </Popup>
      </td>
      <td className='mini ui--media-1400'>
        <LinkExternal
          className='ui--AddressCard-exporer-link'
          data={accountDelegating}
          type='address'
          withShort
        />
      </td>
    </tr>
  );
}

export default React.memo(styled(Address)`

`);
