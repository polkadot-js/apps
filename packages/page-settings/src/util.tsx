// Copyright 2017-2020 @canvas-ui/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Option } from '@canvas-ui/apps-config/settings/types';
import { SettingsStruct } from '@polkadot/ui-settings/types';

import React from 'react';
import { Dropdown, IdentityIcon } from '@canvas-ui/react-components';
import uiSettings from '@polkadot/ui-settings';

export function createOption ({ isHeader, text, value }: Option): Option | React.ReactNode {
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
        {text}
      </div>
    ),
    value
  };
}

export function createIdenticon ({ info, text, value }: Option, overrides: string[] = [], override = 'empty'): Option {
  return {
    text: (
      <div
        className='ui--Dropdown-item'
        key={value}
      >
        <IdentityIcon
          className='ui--Dropdown-icon'
          size={32}
          theme={
            info && overrides.includes(info)
              ? override as 'empty'
              : info as 'substrate'
          }
          value='5F9999K9UgTUgSsbXZQcEmRMvQqwJoBUHMv9e1k2MdgghuRA'
        />
        <div className='ui--Dropdown-name'>{text}</div>
      </div>
    ),
    value
  };
}

export function save (settings: SettingsStruct): void {
  uiSettings.set(settings);
}

export function saveAndReload (settings: SettingsStruct): void {
  save(settings);

  // HACK This is terribe, but since the API needs to re-connect, but since
  // the API does not yet handle re-connections properly, it is what it is
  window.location.reload();
}
