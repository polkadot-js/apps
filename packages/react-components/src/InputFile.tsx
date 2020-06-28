// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React, { useCallback, useState, createRef, MouseEvent } from 'react';
import Dropzone, { DropzoneRef } from 'react-dropzone';
import styled from 'styled-components';
import { formatNumber, isHex, u8aToString, hexToU8a } from '@polkadot/util';

import { ACCENT_DARK_HEX, ELEV_0_CSS, ELEV_2_CSS, ERROR_BG_HEX, ERROR_FOCUS_HEX, HIGH_EMPH_HEX } from './styles/constants';
import { classes } from './util';
import Icon from './Icon';
import Button from './Button';
import FileSupplied from './FileSupplied';
import Labelled from './Labelled';
import { useTranslation } from './translate';

export interface InputFileProps extends BareProps {
  // Reference Example Usage: https://github.com/react-dropzone/react-dropzone/tree/master/examples/Accept
  // i.e. MIME types: 'application/json, text/plain', or '.json, .txt'
  accept?: string;
  clearContent?: boolean;
  convertHex?: boolean;
  errorText?: React.ReactNode;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  label: React.ReactNode;
  onChange?: (contents: Uint8Array, name: string) => void;
  onRemove?: () => void;
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

function InputFile ({ accept, children, className = '', clearContent, convertHex, errorText, help, isDisabled, isError = false, label, onChange, onRemove, placeholder, withEllipsis, withLabel }: InputFileProps): React.ReactElement<InputFileProps> {
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

  const _onRemove = useCallback(
    (event: MouseEvent<HTMLDivElement>): void => {
      event.preventDefault();
      event.stopPropagation();
      setFile(undefined);
      onRemove && onRemove();
    },
    [onRemove]
  );

  const dropZone = (
    <Dropzone
      accept={accept}
      disabled={isDisabled}
      multiple={false}
      onDrop={_onDrop}
      ref={dropRef}
    >
      {({ getInputProps, getRootProps }): JSX.Element => {
        const rootProps = getRootProps({
          className: classes('ui--InputFile', isError ? 'error' : '', !file ? 'isEmpty' : '', className)
        });
        const inputProps = getInputProps();

        return (
          <div {...rootProps} >
            <input {...inputProps} />
            {
              !file
                ? (
                  <>
                    <Icon
                      name='upload'
                      size='large'
                    />
                    <div>
                      {t<string>('Click to select or drag & drop to upload file.')}
                    </div>
                  </>
                )
                : (
                  <FileSupplied
                    errorText={errorText}
                    isError={isError}
                    onRemove={_onRemove}
                    text={file.name}
                  />
                )
            }
            {children && (
              <div className='children'>
                {children}
              </div>
            )}
          </div>
        );
      }}
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
  cursor: pointer;
  display: table;
  font-size: 1rem;
  margin: 0.25rem 0;
  padding: 1rem;

  &.isEmpty {
    ${ELEV_0_CSS}
    width: 100% !important;
    text-align: center;

    i.icon {
      margin-bottom: 0.5rem;
    }
  }

  &:not(.isEmpty) {
    ${ELEV_2_CSS};
  }

  &.error {
    background: ${ERROR_BG_HEX};
    border-color: ${ERROR_FOCUS_HEX};
  }

  &:hover {
    cursor: pointer;
  }

  .children {
    margin-top: 1.5rem;
  }
`);
