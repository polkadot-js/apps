// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AddressFlags } from '@polkadot/react-hooks/types';

import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { useToggle } from '@polkadot/react-hooks';

import AccountName from '../AccountName.js';
import Button from '../Button/index.js';
import IdentityIcon from '../IdentityIcon/index.js';
import Input from '../Input.js';
import { useTranslation } from '../translate.js';

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
  const [isCopyShown, toggleIsCopyShown] = useToggle();
  const NOOP = () => undefined;

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
                ? (defaultValue.toUpperCase() || t('<unknown>'))
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
            <label>{t('index')}:</label> {accountIndex}
          </div>
        )}
      </div>
      <div className='ui--AddressSection__CopyColumn'>
        <div className='ui--AddressMenu-copyaddr'>
          <CopyToClipboard
            text={value}
          >
            <span>
              <Button.Group>
                <Button
                  icon={isCopyShown ? 'check' : 'copy'}
                  label={isCopyShown ? t('Copied') : t('Copy')}
                  onClick={isCopyShown ? NOOP : toggleIsCopyShown }
                  onMouseLeave={isCopyShown ? toggleIsCopyShown : NOOP }
                />
              </Button.Group>
            </span>
          </CopyToClipboard>
        </div>
      </div>
    </div>
  );
}

export default React.memo(AddressSection);
