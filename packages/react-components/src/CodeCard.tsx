// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import store from '@canvas-ui/react-store/store';
import { Code } from '@canvas-ui/react-store/types';
import { ComponentProps } from './types';
import { ELEV_2_CSS } from './styles/constants';
import { useAbi, useToggle, useAppNavigation } from '@canvas-ui/react-hooks';
import { FileState } from '@canvas-ui/react-hooks/types';
import { VoidFn } from '@canvas-ui/react-util/types';
import React, { useCallback } from 'react';
import styled from 'styled-components';

import Abi from './Abi';
import Button from './Button';
import Card from './Card';
import CodeForget from './CodeForget';
import CodeInfo from './CodeInfo';
import CodeUploadABI from './CodeUploadABI';
import { useTranslation } from './translate';

interface Props extends ComponentProps {
  code: Code;
  onForget?: VoidFn;
}

function CodeCard ({ className, code, code: { id }, onForget: _onForget }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { navigateTo } = useAppNavigation();
  const [, , setIsAbiOpen] = useToggle();
  const { abi, isAbiSupplied, onChangeAbi } = useAbi(code);

  const onInstantiate = useCallback(
    (): void => {
      navigateTo.instantiateNew(id)();
    },
    [id, navigateTo]
  );

  const onForget = useCallback(
    (): void => {
      store.forgetCode(id);

      _onForget && _onForget();
    },
    [id, _onForget]
  );

  const onSaveABI = useCallback(
    (file: FileState): void => {
      onChangeAbi(file);
      setIsAbiOpen(true);
    },
    [onChangeAbi, setIsAbiOpen]
  );

  return (
    <Card className={className}>
      <CodeInfo
        code={code}
        isEditable
      >
        {
          isAbiSupplied && abi && (
            <Abi
              abi={abi}
              withConstructors
            />
          )
        }
      </CodeInfo>
      <div className='footer'>
        <Button.Group>
          {abi?.project.source.wasm && abi.project.source.wasm.length === 0 && (
            <CodeUploadABI
              codeHash={code.codeHash}
              label={t(isAbiSupplied ? 'Edit ABI' : 'Add ABI')}
              onSave={onSaveABI}
            />
          )}
          <CodeForget
            code={code}
            onForget={onForget}
          />
          <Button
            isDisabled={!isAbiSupplied}
            isPrimary
            label={t<string>('Instantiate')}
            onClick={onInstantiate}
          />
        </Button.Group>
      </div>
    </Card>
  );
}

export default styled(React.memo(CodeCard))`
  ${ELEV_2_CSS}

  .footer {
    display: flex;
    justify-content: flex-end;
    margin: 1rem 0 0;
    padding: 1rem 0 0;
    border-top: 1px solid var(--grey40);
  }
`;
