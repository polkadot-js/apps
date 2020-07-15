// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback, useState, createRef } from 'react';
import Dropzone, { DropzoneRef } from 'react-dropzone';
import styled from 'styled-components';
import { formatNumber, isHex, u8aToString, hexToU8a } from '@polkadot/util';

import { classes } from './util';
import Labelled from './Labelled';
import { useTranslation } from './translate';

export interface InputFileProps {
  // Reference Example Usage: https://github.com/react-dropzone/react-dropzone/tree/master/examples/Accept
  // i.e. MIME types: 'application/json, text/plain', or '.json, .txt'
  accept?: string;
  className?: string;
  clearContent?: boolean;
  convertHex?: boolean;
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

const BYTE_STR_0 = '0'.charCodeAt(0);
const BYTE_STR_X = 'x'.charCodeAt(0);
const NOOP = (): void => undefined;

function convertResult (result: ArrayBuffer, convertHex?: boolean): Uint8Array {
  const data = new Uint8Array(result);

  // this converts the input (if detected as hex), vai the hex conversion route
  if (convertHex && data[0] === BYTE_STR_0 && data[1] === BYTE_STR_X) {
    const hex = u8aToString(data);

    if (isHex(hex)) {
      return hexToU8a(hex);
    }
  }

  return data;
}

function InputFile ({ accept, className = '', clearContent, convertHex, help, isDisabled, isError = false, label, onChange, placeholder, withEllipsis, withLabel }: InputFileProps): React.ReactElement<InputFileProps> {
  const { t } = useTranslation();
  const dropRef = createRef<DropzoneRef>();
  const [file, setFile] = useState<FileState | undefined>();

  const _onDrop = useCallback(
    (files: File[]): void => {
      files.forEach((file): void => {
        const reader = new FileReader();

        reader.onabort = NOOP;
        reader.onerror = NOOP;

        reader.onload = ({ target }: ProgressEvent<FileReader>): void => {
          if (target && target.result) {
            const name = file.name;
            const data = convertResult(target.result as ArrayBuffer, convertHex);

            onChange && onChange(data, name);
            dropRef && setFile({
              name,
              size: data.length
            });
          }
        };

        reader.readAsArrayBuffer(file);
      });
    },
    [convertHex, dropRef, onChange]
  );

  const dropZone = (
    <Dropzone
      accept={accept}
      disabled={isDisabled}
      multiple={false}
      onDrop={_onDrop}
      ref={dropRef}
    >
      {({ getInputProps, getRootProps }): JSX.Element => (
        <div {...getRootProps({ className: classes('ui--InputFile', isError ? 'error' : '', className) })} >
          <input {...getInputProps()} />
          <em className='label' >
            {
              !file || clearContent
                ? placeholder || t<string>('click to select or drag and drop the file here')
                : placeholder || t<string>('{{name}} ({{size}} bytes)', {
                  replace: {
                    name: file.name,
                    size: formatNumber(file.size)
                  }
                })
            }
          </em>
        </div>
      )}
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

export default React.memo(styled(InputFile)`
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
`);
