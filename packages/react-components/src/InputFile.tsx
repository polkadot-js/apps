// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DropzoneRef } from 'react-dropzone';

import React, { createRef, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { formatNumber, hexToU8a, isHex, u8aToString } from '@polkadot/util';

import Labelled from './Labelled.js';
import { styled } from './styled.js';
import { useTranslation } from './translate.js';

export interface InputFilePropsBase {
  className?: string;
  clearContent?: boolean;
  isDisabled?: boolean;
  isError?: boolean;
  isFull?: boolean;
  label: React.ReactNode;
  labelExtra?: React.ReactNode;
  placeholder?: React.ReactNode | null | false;
  withEllipsis?: boolean;
  withLabel?: boolean;
}

export interface InputFileProps extends InputFilePropsBase {
  // Reference Example Usage: https://github.com/react-dropzone/react-dropzone/tree/master/examples/Accept
  // i.e. MIME types: 'application/json, text/plain', or '.json, .txt'
  accept?: string[];
  onChange?: (contents: Uint8Array, name: string) => void;
}

interface FileState {
  name: string;
  size: number;
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

    while (hex.endsWith(STR_NL)) {
      hex = hex.substring(0, hex.length - 1);
    }

    if (isHex(hex)) {
      return hexToU8a(hex);
    }
  }

  return data;
}

function InputFile ({ accept, className = '', clearContent, isDisabled, isError = false, isFull, label, labelExtra, onChange, placeholder, withEllipsis, withLabel }: InputFileProps): React.ReactElement<InputFileProps> {
  const { t } = useTranslation();
  const dropRef = createRef<DropzoneRef>();
  const [file, setFile] = useState<FileState | undefined>();

  const onDrop = useCallback(
    (files: File[]): void => {
      files.forEach((file): void => {
        const reader = new FileReader();

        reader.onabort = NOOP;
        reader.onerror = NOOP;

        reader.onload = ({ target }: ProgressEvent<FileReader>): void => {
          if (target?.result) {
            const name = file.name;
            const data = convertResult(target.result as ArrayBuffer);

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
    [dropRef, onChange]
  );

  const { getInputProps, getRootProps } = useDropzone({
    accept: accept?.reduce((all, mime) => ({ ...all, [mime]: [] }), {}),
    disabled: isDisabled,
    onDrop
  });

  const dropZone = (
    <StyledDiv {...getRootProps({ className: `${className} ui--InputFile ${isError ? 'error' : ''}` })}>
      <input {...getInputProps()} />
      <em className='label'>
        {
          !file || clearContent
            ? placeholder || t('click to select or drag and drop the file here')
            : placeholder || t('{{name}} ({{size}} bytes)', {
              replace: {
                name: file.name,
                size: formatNumber(file.size)
              }
            })
        }
      </em>
    </StyledDiv>
  );

  return label
    ? (
      <Labelled
        isFull={isFull}
        label={label}
        labelExtra={labelExtra}
        withEllipsis={withEllipsis}
        withLabel={withLabel}
      >
        {dropZone}
      </Labelled>
    )
    : dropZone;
}

const StyledDiv = styled.div`
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  border-radius: 0.28571429rem;
  font-size: var(--font-size-base);
  margin: 0.25rem 0;
  padding: 0.67857143em 1em;
  width: 100% !important;

  &.error {
    background: var(--bg-input-error);
    border-color: #e0b4b4;
  }

  &:hover {
    cursor: pointer;
  }
`;

export default React.memo(InputFile);
