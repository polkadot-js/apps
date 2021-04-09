// Copyright 2017-2021 @polkadot/react-components authors & contributors
// and @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FileState } from '@canvas-ui/react-hooks/types';
import { classes } from '@canvas-ui/react-util';
import React, { createRef, MouseEvent, useCallback } from 'react';
import Dropzone, { DropzoneRef } from 'react-dropzone';
import styled from 'styled-components';

import { hexToU8a, isHex, u8aToString } from '@polkadot/util';

import { ELEV_2_CSS } from './styles/constants';
import FileSupplied from './FileSupplied';
import Icon from './Icon';
import Labelled from './Labelled';
import { useTranslation } from './translate';
import { BareProps } from './types';

interface InputFileProps extends BareProps {
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
  onChange?: (file: FileState | null) => void;
  onRemove?: () => void;
  placeholder?: React.ReactNode | null;
  value: FileState | null;
  withEllipsis?: boolean;
  withLabel?: boolean;
}

const BYTE_STR_0 = '0'.charCodeAt(0);
const BYTE_STR_X = 'x'.charCodeAt(0);
const STR_NL = '\n';
const NOOP = (): void => undefined;

function convertResult (result: ArrayBuffer): Uint8Array {
  const data = new Uint8Array(result);

  // this converts the input (if detected as hex), via the hex conversion route
  if (data[0] === BYTE_STR_0 && data[1] === BYTE_STR_X) {
    let hex = u8aToString(data);

    while (hex[hex.length - 1] === STR_NL) {
      hex = hex.substr(0, hex.length - 1);
    }

    if (isHex(hex)) {
      return hexToU8a(hex);
    }
  }

  return data;
}

function InputFile ({ accept, children, className, errorText, help, isDisabled, isError = false, label, onChange, onRemove, value = null, withEllipsis, withLabel }: InputFileProps): React.ReactElement<InputFileProps> {
  const { t } = useTranslation();
  const dropRef = createRef<DropzoneRef>();

  const _onDrop = useCallback(
    (files: File[]): void => {
      files.forEach((file): void => {
        const reader = new FileReader();

        reader.onabort = NOOP;
        reader.onerror = NOOP;

        reader.onload = ({ target }: ProgressEvent<FileReader>): void => {
          if (target && target.result) {
            const data = convertResult(target.result as ArrayBuffer);
            const fileState = {
              data,
              name: file.name,
              size: data.length
            };

            onChange && onChange(fileState);
          }
        };

        reader.readAsArrayBuffer(file);
      });
    },
    [onChange]
  );

  const _onRemove = useCallback(
    (event: MouseEvent<HTMLDivElement>): void => {
      event.preventDefault();
      event.stopPropagation();
      onChange && onChange(null);
      onRemove && onRemove();
    },
    [onChange, onRemove]
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
          className: classes('ui--InputFile', isError ? 'error' : '', !value ? 'isEmpty' : '', className)
        });
        const inputProps = getInputProps();

        return (
          <div {...rootProps} >
            <input {...inputProps} />
            {
              !value
                ? (
                  <>
                    <Icon
                      icon='upload'
                      size='2x'
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
                    text={value.name}
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
  font-size: 0.875rem;
  padding: 1rem;

  &.isEmpty {
    border: 2px solid #273640;
    border-radius: 0.28571429rem;
    color: var(--grey70);
    width: 100% !important;
    text-align: center;

    .svg-inline--fa {
      margin-bottom: 0.5rem;
    }
  }

  &:not(.isEmpty) {
    ${ELEV_2_CSS}
    border-radius: 0.28571429rem;
  }

  &.error {
    border-color: var(--red-primary);
  }

  &:hover {
    cursor: pointer;
  }

  .children {
    margin-top: 1.5rem;
  }
`);
