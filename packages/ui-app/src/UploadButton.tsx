// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Button$Sizes } from './Button/types';
import { BareProps } from './types';
import { KeyringPair$Json } from '@polkadot/util-keyring/types';

import './UploadButton.css';

import React from 'react';
import isUndefined from '@polkadot/util/is/undefined';
import ReactFileReader from 'react-file-reader';
import keyring from '@polkadot/ui-keyring/index';

import Button from './Button';

type State = {
  address: string
};

type Props = BareProps & {
  icon?: string,
  isCircular?: boolean,
  isPrimary?: boolean,
  size?: Button$Sizes
};

export default class UploadButton extends React.PureComponent<Props, State> {
  state: State = {} as State;

  handleUploadAccount = (files: FileList): void => {
    const fileList: FileList = files;

    if (!fileList.length) {
      console.error('Error retrieving file list');
      return;
    }

    const fileToUpload: File = fileList[0];
    const fileReader: FileReader = new FileReader();

    fileReader.onload = (e) => {
      try {
        if (!isUndefined(e) && e.target !== null) {
          const fileContents: any = JSON.parse(e.target.result);
          if (Object.keys(fileContents).includes('address' && 'encoding' && 'encoded' && 'meta')) {
            const json: KeyringPair$Json = fileContents;

            // FIXME - does not force browser to refresh if account address added to local storage
            keyring.addFromJson(json);
          }
        }
      } catch (e) {
        console.error('Error uploading account to local storage ', e);
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
