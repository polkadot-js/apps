// Copyright 2017-2022 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { AccountName, IdentityIcon, Input } from '@polkadot/react-components';
import { AddressFlags } from '@polkadot/react-hooks/types';

import { useTranslation } from '../translate';

interface Props {
  value: string,
  editingName: boolean,
  defaultValue: string,
  onChange: (value: string) => void,
  flags: AddressFlags,
  accountIndex: string | undefined,
}

function AddressSection ({ accountIndex, defaultValue, editingName, flags, onChange, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className='ui--AddressSection'>
      <IdentityIcon
        size={80}
        value={value}
      />
      <div className='ui--AddressSection__AddressColumn'>
        <AccountName
          override={
            editingName
              ? (
                <Input
                  className='name--input'
                  defaultValue={defaultValue}
                  label='name-input'
                  onChange={onChange}
                  withLabel={false}
                />
              )
              : flags.isEditable
                ? (defaultValue.toUpperCase() || t<string>('<unknown>'))
                : undefined
          }
          value={value}
          withSidebar={false}
        />
        <div className='ui--AddressMenu-addr'>
          {value}
        </div>
        {accountIndex && (
          <div className='ui--AddressMenu-index'>
            <label>{t<string>('index')}:</label> {accountIndex}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(AddressSection);
