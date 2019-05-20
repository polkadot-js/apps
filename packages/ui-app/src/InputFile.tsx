// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WithTranslation } from 'react-i18next';
import { BareProps } from './types';

import React from 'react';
import Dropzone from 'react-dropzone';

import { classes } from './util';
import Labelled from './Labelled';
import translate from './translate';

type Props = BareProps & WithTranslation & {
  // Reference Example Usage: https://github.com/react-dropzone/react-dropzone/tree/master/examples/Accept
  // i.e. MIME types: 'application/json, text/plain', or '.json, .txt'
  accept?: string,
  clearContent?: boolean,
  help?: React.ReactNode,
  isDisabled?: boolean,
  isError?: boolean,
  label: React.ReactNode,
  onChange?: (contents: Uint8Array, name: string) => void,
  placeholder?: React.ReactNode | null,
  withEllipsis?: boolean,
  withLabel?: boolean
};

type State = {
  file?: {
    name: string,
    size: number
  }
};

type LoadEvent = {
  target: {
    result: ArrayBuffer
  }
};

class InputFile extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const { accept, className, clearContent, help, isDisabled, isError = false, label, placeholder, t, withEllipsis, withLabel } = this.props;
    const { file } = this.state;

    return (
      <Labelled
        help={help}
        label={label}
        withEllipsis={withEllipsis}
        withLabel={withLabel}
      >
        <Dropzone
          accept={accept}
          className={classes('ui--InputFile', isError ? 'error' : '', className)}
          disabled={isDisabled}
          multiple={false}
          onDrop={this.onDrop}
        >
          <div className='label'>
            {
              !file || clearContent
                ? placeholder || t('click to select or drag and drop the file here')
                : placeholder || t('{{name}} ({{size}} bytes)', {
                  replace: file
                })
            }
          </div>
        </Dropzone>
      </Labelled>
    );
  }

  private onDrop = (files: Array<File>) => {
    const { onChange } = this.props;

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => {
        // ignore
      };

      reader.onerror = () => {
        // ignore
      };

      // @ts-ignore ummm... events are not properly specified here?
      reader.onload = ({ target: { result } }: LoadEvent) => {
        const data = new Uint8Array(result);
        const name = file.name;

        onChange && onChange(data, name);

        this.setState({
          file: {
            name,
            size: data.length
          }
        });
      };

      reader.readAsArrayBuffer(file);
    });
  }
}

export default translate(InputFile);
