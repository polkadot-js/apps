// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps, RawParam } from '../../types';

import React from 'react';
import Dropzone from 'react-dropzone';
import withObservable from '@polkadot/rx-react/with/observable';

import translate from '../../translate';
import Base from './Base';

type Props = BareProps & {
  isError?: boolean,
  label: string,
  onChange: (file?: File, contents?: Uint8Array) => void,
  subject: rxjs$BehaviorSubject<RawParam>,
  t: I18Next$Translate
}

type WrappedProps = Props & {
  value: RawParam
}

function BytesFile ({ className, isError, label, onChange, subject, t }: Props): React$Node {
  const onDrop = (files: Array<File>) => {
    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () =>
        // flowlint-next-line unclear-type:off
        onChange(file, new Uint8Array((((reader.result): any): ArrayBuffer)));
      reader.onabort = () =>
        onChange();
      reader.onerror = () =>
        onChange();

      reader.readAsArrayBuffer(file);
    });
  };

  const Component = withObservable(subject)(({ value: { data } = {} }: WrappedProps): React$Node => {
    // flowlint-next-line sketchy-null-bool:off
    const classes = ['extrinsics--Param-File', isError ? 'error' : '', !!data, className].join(' ');

    return (
      <Base
        label={label}
        size='full'
      >
        <Dropzone
          className={classes}
          multiple={false}
          onDrop={onDrop}
        >
          <div className='label'>
            {
              !data
                ? t('file.dnd', {
                  defaultValue: 'drag and drop the file here'
                })
                : t('file.description', {
                  defaultValue: '{{name}} ({{size}} bytes)',
                  replace: {
                    name: data.name,
                    size: data.size
                  }
                })
            }
          </div>
        </Dropzone>
      </Base>
    );
  });

  return (
    <Component />
  );
}

export default translate(BytesFile);
