// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Button$Sizes } from './Button/types';
import { BareProps } from './types';
import { KeyringPair$Json } from '@polkadot/util-keyring/types';

import './DownloadButton.css';

import React from 'react';
/// <reference path="./@types/file-saver/index.d.ts" />
import FileSaver from 'file-saver';
import keyring from '@polkadot/ui-keyring/index';
import isUndefined from '@polkadot/util/is/undefined';

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

    try {
      const json: KeyringPair$Json = keyring.toJson(address);

      if (!isUndefined(json)) {
        const blob: Blob = new Blob([JSON.stringify(json)], { type: 'text/plain;charset=utf-8' });

        FileSaver.saveAs(blob, `paritytech-polkadot-publickey-${address}.json`);
      } else {
        console.error('Error obtaining account data to save to file');
      }
    } catch (e) {
      console.error('Error retrieving account from local storage and saving account to file: ', e);
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
