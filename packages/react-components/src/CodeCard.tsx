// Copyright 2017-2020 @polkadot/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CodeStored } from '@polkadot/apps/types';
import { FileState } from '@polkadot/react-hooks/types';
import { BareProps, VoidFn } from './types';

import React, { useCallback } from 'react';
import styled from 'styled-components';
import store from '@polkadot/apps/store';
import { ELEV_1_CSS } from '@polkadot/react-components/styles/constants';
import { useAbi, useToggle } from '@polkadot/react-hooks';

import Button from './Button';
import CodeForget from './CodeForget';
import CodeInfo from './CodeInfo';
import CodeUploadABI from './CodeUploadABI';
import Expander from './Expander';
import Messages from './Messages';
import { useTranslation } from './translate';

interface Props extends BareProps {
  code: CodeStored;
  onAddABI: VoidFn;
  onDeploy: VoidFn;
  onForget: VoidFn;
}

function CodeCard (props: Props): React.ReactElement<Props> {
  const { className, code, code: { contractAbi, id }, onDeploy } = props;
  const { t } = useTranslation();
  const [isAbiOpen, toggleIsAbiOpen, setIsAbiOpen] = useToggle();
  const { isAbiSupplied, onChangeAbi } = useAbi(code);

  const onForget = useCallback(
    (): void => {
      store.forgetCode(id);
    },
    [id]
  );

  const onSaveABI = useCallback(
    (file: FileState): void => {
      onChangeAbi(file);
      setIsAbiOpen(true);
    },
    []
  )

  return (
    <article className={className}>
      <CodeInfo
        code={code}
        isEditable
      >
        {
          isAbiSupplied && (
              <Expander
                isOpen={isAbiOpen}
                onClick={toggleIsAbiOpen}
                summary={t('ABI')}
              >
                <Messages
                  contractAbi={contractAbi}
                  isLabelled={false}
                  isRemovable={false}
                  withConstructors
                />
              </Expander>
            )
        }
        </CodeInfo>
        <div className='footer'>
          <Button.Group>
            <CodeUploadABI
              label={t(isAbiSupplied ? 'Edit ABI' : 'Add ABI')}
              onSave={onSaveABI}
            />
            <CodeForget
              code={code}
              onForget={onForget}
            />
            <Button
              isPrimary
              label={t('Deploy')}
              onClick={onDeploy}
            />
          </Button.Group>
        </div>
      </article>
    );
}

export default styled(React.memo(CodeCard))`
  ${ELEV_1_CSS}

  .footer {
    display: flex;
    justify-content: flex-end;
    margin: 1rem 0 0;
    padding: 1rem 0 0;
    border-top: 1px solid var(--grey40);
  }
`
