// Copyright 2017-2021 @polkadot/app-execute authors & contributors
// and @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from './types';
import { FileState } from '@canvas-ui/react-hooks/types';
import React from 'react';
import styled from 'styled-components';

import { Abi } from '@polkadot/api-contract';

import InputFile from './InputFile';
import Messages from './Messages';
import { useTranslation } from './translate';

interface Props extends BareProps {
  abi?: Abi | null;
  errorText?: string | null;
  file: FileState | null;
  isContract?: boolean;
  isError?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isValid?: boolean;
  isSupplied?: boolean;
  label?: React.ReactNode;
  onRemove?: () => void;
  onRemoved?: () => void;
  onSelect?: () => void;
  onSelectConstructor?: (constructorIndex?: number) => void;
  setFile: React.Dispatch<FileState | null>;
  withLabel?: boolean;
}

function renderMessages ({ abi, isDisabled, onRemove, onSelectConstructor, withLabel }: Props): React.ReactNode {
  return (
    <Messages
      abi={abi}
      isLabelled={withLabel}
      isRemovable={!isDisabled}
      onRemove={onRemove}
      onSelectConstructor={onSelectConstructor}
      withConstructors
    />
  );
}

function InputABI (props: Props): React.ReactElement<Props> {
  const { abi, className, errorText, file, isContract = false, isDisabled, isError, isRequired = false, isValid, setFile, withLabel } = props;
  const { t } = useTranslation();

  const help = isContract
    ? t<string>('The ABI or .contract bundle for the WASM code. Since we will be making a call into the code, the ABI is required and stored for future operations such as sending messages.')
    : t<string>('The .contract bundle or ABI for the WASM code. If using an ABI, you will need to upload the generated WASM file separately.');
  const label = isRequired
    ? 'Upload ABI'
    : 'Upload Contract Bundle';

  return (
    <InputFile
      className={className}
      errorText={t<string>(
        'Invalid ABI file — {{errorText}}',
        { replace: { errorText } }
      )}
      help={help}
      isDisabled={isDisabled}
      isError={isError}
      label={label}
      onChange={setFile}
      value={file}
      withLabel={withLabel}
    >
      {(abi && isValid) ? renderMessages(props) : null}
    </InputFile>
  );
}

export default React.memo(
  styled(InputABI)`
    min-height: 4rem;
  `
);
