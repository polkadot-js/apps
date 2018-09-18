// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TranslationFunction } from 'i18next';
import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import Dropzone from 'react-dropzone';
import UploadIcon from '@polkadot/ui-app/UploadIcon';

import classes from '../util/classes';
import translate from '../translate';
import Base from '../Params/Param/Base';

type Props = BareProps & {
  acceptedFormats?: string,
  isDisabled?: boolean,
  isError?: boolean,
  label: string,
  onChange?: (contents: Uint8Array) => void,
  placeholder?: string,
  shouldDisplayFile?: boolean,
  t: TranslationFunction,
  withLabel?: boolean,
  withIcon?: boolean
};

type State = {
  file?: {
    name: string,
    size: number
  }
};

type LoadEvent = {
  target: { // eslint-disable-line react/no-unused-prop-types
    result: ArrayBuffer
  }
};

class InputFile extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const { acceptedFormats, className, isDisabled, isError = false, label, placeholder, shouldDisplayFile = true, style, t, withLabel } = this.props;
    const { file } = this.state;

    return (
      <Base
        label={label}
        size='full'
        withLabel={withLabel}
        style={style}
      >
        <Dropzone
          accept={acceptedFormats}
          className={classes('ui--InputFile-File', isError ? 'error' : '', className)}
          disabled={isDisabled}
          multiple={false}
          onDrop={this.onDrop}
        >
          <div className='label'>
            <div className='ui--InputFile-UploadIcon'>{ this.renderIcon() }</div>
            <div className='ui--InputFile-messages'>
              {
                !file || !shouldDisplayFile
                  ? placeholder || t('file.dnd', {
                    defaultValue: 'drag and drop the file here'
                  })
                  : placeholder || t('file.description', {
                    defaultValue: '{{name}} ({{size}} bytes)',
                    replace: file
                  })
              }
            </div>
          </div>
        </Dropzone>
      </Base>
    );
  }

  protected renderIcon () {
    const { withIcon = true } = this.props;

    if (!withIcon) {
      return null;
    }

    return (
      <UploadIcon />
    );
  }

  onDrop = (files: Array<File>) => {
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

        onChange && onChange(data);

        this.setState({
          file: {
            name: file.name,
            size: data.length
          }
        });
      };

      reader.readAsArrayBuffer(file);
    });
  }
}

export default translate(InputFile);
