// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Button$Sizes } from './Button/types';
import { BareProps } from './types';

import './DownloadButton.css';

import React from 'react';
import store from 'store';
import { saveAs } from 'file-saver/FileSaver';
import { accountKey } from '@polkadot/ui-keyring/defaults';

import Button from './Button';

type Props = BareProps & {
  icon?: string,
  isCircular?: boolean,
  isPrimary?: boolean,
  size?: Button$Sizes,
  address: string
};

export default class DownloadButton extends React.PureComponent<Props> {

  handleDownloadAccount = (): void => {
    const { address } = this.props;

    // TODO - Add feature to download all accounts by cycling through all accounts
    // in local storage and download them for the user to separate JSON files. Use a
    // separate Download All icon. Add feature to allow user to switch between different accounts
    // stored in local storage

    console.log('Download from local storage account address: ', address);
    const localStorageAccountKey = accountKey(address);

    try {
      const localStorageAccountValue = store.get(localStorageAccountKey);
      console.log('Success retrieving account from local storage: ', localStorageAccountValue);

      // convert to JSON stringified format
      const accountDataJSONObject = {
        key: localStorageAccountKey,
        value: JSON.stringify(localStorageAccountValue).replace(/"/g, '\"')
      };

      const accountDataJSONStringified = JSON.stringify(accountDataJSONObject);
      console.log('accountDataJSONStringified: ', accountDataJSONStringified);

      // TODO - download the JSON stringified account data to a JSON file

      const blob: Blob = new Blob([accountDataJSONStringified], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `paritytech-polkadot-publickey-${address}.json`);
    } catch (e) {
      console.log('Error retrieving account from local storage: ', e);
    }
  }

  render () {
    const { className, icon = 'download', isCircular = true, isPrimary = true, size = 'tiny', style, address } = this.props;

    return (
      <div className={'accounts--Address-download'}>
        <Button
          className={className}
          icon={icon}
          isCircular={isCircular}
          isPrimary={isPrimary}
          onClick={this.handleDownloadAccount}
          size={size}
          style={style}
        />
      </div>
    );
  }
}
