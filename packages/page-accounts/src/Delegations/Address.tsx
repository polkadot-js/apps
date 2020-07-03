// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance, Conviction } from '@polkadot/types/interfaces';

import React, { useCallback, useState } from 'react';
import { AddressSmall, Button, Icon, LinkExternal, Menu, Popup } from '@polkadot/react-components';

import Delegate from './modals/Delegate';
import { useTranslation } from '../translate';
import { FormatBalance } from '@polkadot/react-query';
import Undelegate from './modals/Undelegate';

interface Props {
  accountDelegated: string;
  accountDelegating: string;
  amount: Balance;
  className?: string;
  conviction: Conviction;
  isFavorite: boolean;
  toggleFavorite: (address: string) => void;
}

function Address ({ accountDelegated, accountDelegating, amount, className = '', conviction, isFavorite, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [isSettingPopupOpen, setIsSettingPopupOpen] = useState(false);
  const [isDelegateOpen, setIsDelegateOpen] = useState(false);
  const [isUndelegateOpen, setIsUndelegateOpen] = useState(false);

  const _onFavorite = useCallback(
    (): void => toggleFavorite(accountDelegating),
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
        <AddressSmall value={accountDelegating} />
        {accountDelegating && (
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
                accountDelegating={accountDelegating}
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

export default React.memo(Address);
