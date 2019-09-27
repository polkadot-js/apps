// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WithTranslation } from 'react-i18next';
import { BareProps } from './types';

import React, { useRef, useState } from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import { formatNumber } from '@polkadot/util';

import { classes } from './util';
import Labelled from './Labelled';
import translate from './translate';

interface Props extends BareProps, WithTranslation {
  // Reference Example Usage: https://github.com/react-dropzone/react-dropzone/tree/master/examples/Accept
  // i.e. MIME types: 'application/json, text/plain', or '.json, .txt'
  accept?: string;
  clearContent?: boolean;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  label: React.ReactNode;
  onChange?: (contents: Uint8Array, name: string) => void;
  placeholder?: React.ReactNode | null;
  withEllipsis?: boolean;
  withLabel?: boolean;
}

interface FileState {
  name: string;
  size: number;
}

interface LoadEvent {
  target: {
    result: ArrayBuffer;
  };
}

function InputFile ({ accept, className, clearContent, help, isDisabled, isError = false, label, onChange, placeholder, t, withEllipsis, withLabel }: Props): React.ReactElement<Props> {
  const dropRef = useRef<Dropzone | null>(null);
  const [file, setFile] = useState<FileState | undefined>();

  const _onDrop = (files: File[]): void => {
    files.forEach((file): void => {
      const reader = new FileReader();

      reader.onabort = (): void => {};
      reader.onerror = (): void => {};

      // ummm... events are not properly specified here?
      (reader as any).onload = ({ target: { result } }: LoadEvent): void => {
        const data = new Uint8Array(result);
        const name = file.name;

        onChange && onChange(data, name);

        if (dropRef && dropRef.current) {
          setFile({
            name,
            size: data.length
          });
        }
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const dropZone = (
    <Dropzone
      accept={accept}
      className={classes('ui--InputFile', isError && 'error', className)}
      disabled={isDisabled}
      multiple={false}
      ref={dropRef}
      onDrop={_onDrop}
    >
      <em className='label'>
        {!file || clearContent
          ? placeholder || t('click to select or drag and drop the file here')
          : placeholder || t('{{name}} ({{size}} bytes)', {
            replace: {
              name: file.name,
              size: formatNumber(file.size)
            }
          })
        }
      </em>
    </Dropzone>
  );

  return label
    ? (
      <Labelled
        help={help}
        label={label}
        withEllipsis={withEllipsis}
        withLabel={withLabel}
      >
        {dropZone}
      </Labelled>
    )
    : dropZone;
}

export default translate(
  styled(InputFile)`
    background: #fff;
    border: 1px solid rgba(34, 36, 38, 0.15);
    border-radius: 0.28571429rem;
    font-size: 1rem;
    margin: 0.25rem 0;
    padding: 1rem;
    width: 100% !important;

    &.error {
      background: #fff6f6;
      border-color: #e0b4b4;
    }

    &:hover {
      background: #fefefe;
      cursor: pointer;
    }

    .label {
      color: rgba(0, 0, 0, .6);
    }
  `
);
