// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Code } from '@canvas-ui/react-store/types';
import { useNotification, useToggle } from '@canvas-ui/react-hooks';
import { truncate } from '@canvas-ui/react-util';
import { VoidFn } from '@canvas-ui/react-util/types';
import React, { useCallback } from 'react';
import styled from 'styled-components';

import Button from './Button';
import CodeInfo from './CodeInfo';
import Modal from './Modal';
import { useTranslation } from './translate';
import { BareProps } from './types';

interface Props extends BareProps {
  code: Code;
  onForget: VoidFn;
}

function CodeForget ({ className, code, onForget }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const showNotification = useNotification();
  const [isOpen, toggleIsOpen] = useToggle();

  const _onForget = useCallback(
    (): void => {
      onForget();
      toggleIsOpen();

      showNotification({
        action: truncate(code.codeHash),
        message: t<string>('code bundle removed'),
        status: 'success'
      });
    },
    [code.codeHash, onForget, showNotification, t, toggleIsOpen]
  );

  return (
    <>
      <Button
        isNegative
        label={t<string>('Forget')}
        onClick={toggleIsOpen}
      />
      <Modal
        className={className}
        isOpen={isOpen}
        onClose={toggleIsOpen}
      >
        <Modal.Header>{t<string>('Forget code bundle?')}</Modal.Header>
        <Modal.Content>
          <p>
            {t<string>('You are about to remove this code from your list of available code hashes. Once completed, should you need to access it again, you will have to manually add the code hash again.')}
          </p>
          <p>
            {t<string>('This operation does not remove the uploaded code WASM and ABI from the chain, nor any instantiated contracts. The forget operation only limits your access to the code on this browser.')}
          </p>
          <CodeInfo
            className='forget-code'
            code={code}
          />
        </Modal.Content>
        <Modal.Actions onCancel={toggleIsOpen}>
          <Button
            isPrimary
            label={t<string>('Forget')}
            onClick={_onForget}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default styled(React.memo(CodeForget))`
  .forget-code {
    border-top: 1px solid var(--grey30);
    margin-top: 1.5rem;
    padding-top: 1.5rem;
  }
`;
