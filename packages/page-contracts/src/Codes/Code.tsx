// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CodeStored } from '../types';

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Button, Card, Expander, Forget } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { ABI, CodeRow } from '../shared';
import RemoveABI from '../RemoveABI';
import store from '../store';
import useAbi from '../useAbi';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
  code: CodeStored;
  onShowDeploy: (codeHash?: string, constructorIndex?: number) => () => void;
}

function Code ({ className, code, onShowDeploy }: Props): React.ReactElement<Props> {
  const { json: { codeHash } } = code;
  const { t } = useTranslation();
  const [isAbiOpen, toggleIsAbiOpen] = useToggle();
  const [isForgetOpen, toggleIsForgetOpen] = useToggle();
  const [isRemoveABIOpen, toggleIsRemoveABIOpen] = useToggle();
  const { contractAbi, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi([code.json.abi || null, code.contractAbi || null], codeHash, true);

  const _onShowDeploy = useCallback(
    () => onShowDeploy(codeHash)(),
    [codeHash, onShowDeploy]
  );

  const _onDeployConstructor = useCallback(
    (constructorIndex = 0) => codeHash && onShowDeploy && onShowDeploy(codeHash, constructorIndex)(),
    [codeHash, onShowDeploy]
  );

  const _onForget = useCallback(
    (): void => {
      if (!codeHash) {
        return;
      }

      try {
        store.forgetCode(codeHash);
      } catch (error) {
        console.error(error);
      } finally {
        toggleIsForgetOpen();
      }
    },
    [codeHash, toggleIsForgetOpen]
  );

  const abiNode = (
    <ABI
      contractAbi={contractAbi}
      isError={isAbiError}
      isSupplied={isAbiSupplied}
      isValid={isAbiValid}
      onChange={onChangeAbi}
      onRemove={toggleIsRemoveABIOpen}
      onSelectConstructor={_onDeployConstructor}
    />
  );

  return (
    <Card className={className}>
      <CodeRow
        buttons={
          <>
            <Button
              icon='trash'
              onClick={toggleIsForgetOpen}
              tooltip={t('Forget this code hash')}
            />
            <Button
              icon='upload'
              label={t('deploy')}
              onClick={_onShowDeploy}
              tooltip={t('Deploy this code hash as a smart contract')}
            />
          </>
        }
        code={code}
        withTags
      >
        {contractAbi
          ? (
            <Expander
              isOpen={isAbiOpen}
              onClick={toggleIsAbiOpen}
              summary={t<string>('ABI')}
            >
              {abiNode}
            </Expander>
          )
          : abiNode
        }
      </CodeRow>
      {isForgetOpen && (
        <Forget
          key='modal-forget-account'
          mode='code'
          onClose={toggleIsForgetOpen}
          onForget={_onForget}
        >
          <CodeRow
            code={code || ''}
            isInline
          >
            <p>{t<string>('You are about to remove this code from your list of available code hashes. Once completed, should you need to access it again, you will have to manually add the code hash again.')}</p>
            <p>{t<string>('This operation does not remove the uploaded code WASM and ABI from the chain, nor any deployed contracts. The forget operation only limits your access to the code on this browser.')}</p>
          </CodeRow>
        </Forget>
      )}
      {isRemoveABIOpen && (
        <RemoveABI
          code={code}
          key='modal-remove-abi'
          onClose={toggleIsRemoveABIOpen}
          onRemove={onRemoveAbi}
        />
      )}
    </Card>
  );
}

export default React.memo(
  styled(Code)`
    max-width: 100%;
    min-width: 100%;
  `
);
