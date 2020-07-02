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

import Transfer from '../Accounts/modals/Transfer';
import { useTranslation } from '../translate';
import { FormatBalance } from '@polkadot/react-query';

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
  const [isTransferOpen, setIsTransferOpen] = useState(false);

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

  const _toggleTransfer = useCallback(
    (): void => setIsTransferOpen(!isTransferOpen),
    [isTransferOpen]
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
            {isTransferOpen && (
              <Transfer
                key='modal-transfer'
                onClose={_toggleTransfer}
                recipientId={accountDelegating}
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
          icon='paper-plane'
          key='deposit'
          label={t<string>('deposit')}
          onClick={_toggleTransfer}
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
            NOTHING HERE
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
