// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Button$Sizes } from './Button/types';
import { BareProps } from './types';

import './UploadButton.css';

import React from 'react';
import store from 'store';
import decodeAddress from '@polkadot/util-keyring/address/decode';
import ReactFileReader from 'react-file-reader';

import Button from './Button';

type Props = BareProps & {
  icon?: string,
  isCircular?: boolean,
  isPrimary?: boolean,
  size?: Button$Sizes,
  address: string
};

export default class UploadButton extends React.PureComponent<Props> {

  handleUploadAccount = (files): void => {
    const fileList: FileList = files;

    if (!fileList.length) {
      console.log('Error retrieving file list');
      return;
    }

    const fileToUpload: File = fileList[0];
    const fileReader: FileReader = new FileReader();
    let fileContents: string = '';
    let localStorageAccountKey: string = '';
    let localStorageAccountValue: string = '';

    fileReader.onload = (e) => {
      console.log(e.target.result);
      fileContents = JSON.parse(e.target.result);

      console.log('Uploading to Local Storage');
      localStorageAccountKey = fileContents['key'];
      localStorageAccountValue = JSON.parse(fileContents['value']);

      try {
        // TODO - Check that decoded account key is valid to prevent assertion error
        // `Invalid decoded address prefix error` from util-keyring/address/decode.js

        store.set(localStorageAccountKey, localStorageAccountValue);
        console.log('Success uploading account to local storage: ', localStorageAccountKey, localStorageAccountValue);
      } catch (e) {
        console.log('Error uploading account to local storage ', e);
      }
    };
    fileReader.readAsText(fileToUpload);
  }

  render () {
    const { className, icon = 'upload', isCircular = true, isPrimary = true, size = 'tiny', style } = this.props;

    return (
      <div className={'accounts--Address-upload'}>
        <ReactFileReader fileTypes={['.json']} base64={false} multipleFiles={false} handleFiles={this.handleUploadAccount}>
          <Button
            className={className}
            icon={icon}
            isCircular={isCircular}
            isPrimary={isPrimary}
            size={size}
            style={style}
          />
        </ReactFileReader>
      </div>
    );
  }
}
