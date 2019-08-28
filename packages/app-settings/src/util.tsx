// Copyright 2017-2019 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SettingsStruct } from '@polkadot/ui-settings/types';
import { Option, SetOption } from './types';

import React from 'react';
import { ChainImg } from '@polkadot/react-components';
import uiSettings from '@polkadot/ui-settings';

export function createOption ({ info, text, value }: SetOption, overrides: string[] = [], override: string = 'empty'): Option {
  return {
    text: (
      <div className='ui--Dropdown-item'>
        <ChainImg
          className='ui--Dropdown-icon'
          logo={
            overrides.includes(info)
              ? override
              : info
          }
        />
        <div className='ui--Dropdown-name'>{text}</div>
      </div>
    ),
    value
  };
}

export function saveAndReload (settings: SettingsStruct | null): void {
  if (!settings) {
    return;
  }

  uiSettings.set(settings);

  // HACK This is terribe, but since the API needs to re-connect, but since
  // the API does not yet handle re-connections properly, it is what it is
  window.location.reload();
}
