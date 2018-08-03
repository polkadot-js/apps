// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Button$Sizes } from './Button/types';
import { BareProps } from './types';

import './DownloadButton.css';

import React from 'react';
import store from 'store';
/// <reference path="./@types/file-saver/index.d.ts" />
import FileSaver from 'file-saver';
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

    const localStorageAccountKey = accountKey(address);

    try {
      const localStorageAccountValue = store.get(localStorageAccountKey);

      const accountDataJSONObject = {
        key: localStorageAccountKey,
        value: JSON.stringify(localStorageAccountValue).replace(/"/g, '\"')
      };

      const accountDataJSONStringified = JSON.stringify(accountDataJSONObject);

      const blob: Blob = new Blob([accountDataJSONStringified], { type: 'text/plain;charset=utf-8' });

      FileSaver.saveAs(blob, `paritytech-polkadot-publickey-${address}.json`);
    } catch (e) {
      console.error('Error retrieving account from local storage: ', e);
    }
  }

  render () {
    const { className, icon = 'download', isCircular = true, isPrimary = true, size = 'tiny', style } = this.props;

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
