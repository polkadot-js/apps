// Copyright 2017-2025 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/apps-config/settings/types';
import type { SettingsStruct } from '@polkadot/ui-settings/types';

import React from 'react';

import { ChainImg, Dropdown, IdentityIcon } from '@polkadot/react-components';
import { settings } from '@polkadot/ui-settings';

export function createOption ({ info, isHeader, text, value }: Option, overrides: string[] = [], override = 'empty', extra?: string): Option | React.ReactNode {
  if (isHeader) {
    return (
      <Dropdown.Header
        content={text}
        key={text as string}
      />
    );
  }

  return {
    text: (
      <div
        className='ui--Dropdown-item'
        key={value}
      >
        <ChainImg
          className='ui--Dropdown-icon'
          logo={
            info && overrides.includes(info)
              ? override
              : info
          }
        />
        <div className='ui--Dropdown-name'>{text}{extra}</div>
      </div>
    ),
    value
  };
}

export function createIdenticon ({ info, text, value }: Option, overrides: string[] = [], override = 'empty'): Option {
  const theme = info && overrides.includes(info)
    ? override as 'empty'
    : info as 'substrate';

  return {
    text: (
      <div
        className='ui--Dropdown-item'
        key={value}
      >
        {theme === 'empty'
          ? (
            <ChainImg
              className='ui--Dropdown-icon'
              logo='empty'
            />
          )
          : (
            <IdentityIcon
              className='ui--Dropdown-icon'
              size={32}
              theme={theme}
              value='5F9999K9UgTUgSsbXZQcEmRMvQqwJoBUHMv9e1k2MdgghuRA'
            />
          )}
        <div className='ui--Dropdown-name'>{text}</div>
      </div>
    ),
    value
  };
}

export function save (state: SettingsStruct): void {
  settings.set(state);
}

export function saveAndReload (state: SettingsStruct): void {
  save(state);

  // HACK This is terrible, but since the API needs to re-connect and
  // the API does not yet handle re-connections properly, it is what it is
  window.location.reload();
}
