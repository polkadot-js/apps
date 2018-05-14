// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import Dropzone from 'react-dropzone';

import translate from '../../translate';
import Base from './Base';

type Props = BareProps & {
  isDisabled?: boolean,
  isError?: boolean,
  label: string,
  onChange: (contents: Uint8Array) => void,
  t: I18Next$Translate,
  withLabel?: boolean
}

type State = {
  file?: {
    name: string,
    size: number
  }
};

class BytesFile extends React.PureComponent<Props, State> {
  state: State = {};

  render (): React$Node {
    const { className, isDisabled, isError = false, label, t, withLabel } = this.props;
    const { file } = this.state;

    return (
      <Base
        label={label}
        size='full'
        withLabel={withLabel}
      >
        <Dropzone
          className={['ui--Param-File', isError ? 'error' : '', className].join(' ')}
          disabled={isDisabled}
          multiple={false}
          onDrop={this.onDrop}
        >
          <div className='label'>
            {
              !file
                ? t('file.dnd', {
                  defaultValue: 'drag and drop the file here'
                })
                : t('file.description', {
                  defaultValue: '{{name}} ({{size}} bytes)',
                  replace: file
                })
            }
          </div>
        </Dropzone>
      </Base>
    );
  }

  onDrop = (files: Array<File>) => {
    const { onChange } = this.props;

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => {};
      reader.onerror = () => {};
      reader.onload = () => {
        // flowlint-next-line unclear-type:off
        const data = new Uint8Array((((reader.result): any): ArrayBuffer));

        onChange(data);

        this.setState({
          file: {
            name: file.name,
            size: data.length
          }
        });
      };

      reader.readAsArrayBuffer(file);
    });
  };
}

export default translate(BytesFile);
