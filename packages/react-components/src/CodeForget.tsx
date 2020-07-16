// Copyright 2017-2020 @polkadot/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, VoidFn } from './types';

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useToggle } from '@polkadot/react-hooks';

import Button from './Button';
import CodeInfo from './CodeInfo';
import Modal from './Modal';
import { useTranslation } from './translate';
import { CodeStored } from '@polkadot/apps/types';

interface Props extends BareProps {
  code: CodeStored;
  onForget: VoidFn;
}

function CodeUploadABI ({ className, code, onForget }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isOpen, toggleIsOpen] = useToggle();

  const _onForget = useCallback(
    (): void => {
      onForget();
      toggleIsOpen();
    },
    [onForget]
  )

  return (
    <>
      <Button
        isNegative
        label={t('Forget')}
        onClick={toggleIsOpen}
      />
      <Modal
        className={className}
        isOpen={isOpen}
        onClose={toggleIsOpen}
      >
        <Modal.Header>{t('Forget code bundle?')}</Modal.Header>
        <Modal.Content>
          <p>
            {t('You are about to remove this code from your list of available code hashes. Once completed, should you need to access it again, you will have to manually add the code hash again.')}
          </p>
          <p>
            {t('This operation does not remove the uploaded code WASM and ABI from the chain, nor any deployed contracts. The forget operation only limits your access to the code on this browser.')}
          </p>
          <CodeInfo
            className='forget-code'
            code={code}
          />
        </Modal.Content>
        <Modal.Actions onCancel={toggleIsOpen}>
          <Button
            isPrimary
            label={t('Forget')}
            onClick={_onForget}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default styled(React.memo(CodeUploadABI))`
  .forget-code {
    border-top: 1px solid var(--grey30);
    margin-top: 1.5rem;
    padding-top: 1.5rem;
  }
`
