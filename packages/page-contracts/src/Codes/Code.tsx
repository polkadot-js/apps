// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { Codec } from '@polkadot/types/types';
import type { CodeStored } from '../types.js';

import React, { useCallback } from 'react';

import { Button, Card, CopyButton, Forget, styled } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';

import { CodeRow, Messages } from '../shared/index.js';
import store from '../store.js';
import { useTranslation } from '../translate.js';
import useAbi from '../useAbi.js';

interface Props {
  className?: string;
  code: CodeStored;
  onShowDeploy: (codeHash: string, constructorIndex: number) => void;
}

function Code ({ className, code, onShowDeploy }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const optCode = useCall<Option<Codec>>(api.query.contracts.pristineCode || api.query.contracts.codeStorage, [code.json.codeHash]);
  const [isForgetOpen, toggleIsForgetOpen] = useToggle();
  const { contractAbi } = useAbi([code.json.abi, code.contractAbi], code.json.codeHash, true);

  const _onShowDeploy = useCallback(
    () => onShowDeploy(code.json.codeHash, 0),
    [code, onShowDeploy]
  );

  const _onDeployConstructor = useCallback(
    (constructorIndex?: number): void => {
      onShowDeploy && onShowDeploy(code.json.codeHash, constructorIndex || 0);
    },
    [code, onShowDeploy]
  );

  const _onForget = useCallback(
    (): void => {
      try {
        store.forgetCode(code.json.codeHash);
      } catch (error) {
        console.error(error);
      } finally {
        toggleIsForgetOpen();
      }
    },
    [code, toggleIsForgetOpen]
  );

  return (
    <StyledTr className={className}>
      <td className='address top'>
        <Card>
          <CodeRow
            code={code}
            withTags={false}
          />
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
                <p>{t('You are about to remove this code from your list of available code hashes. Once completed, should you need to access it again, you will have to manually add the code hash again.')}</p>
                <p>{t('This operation does not remove the uploaded code WASM and ABI from the chain, nor any deployed contracts. The forget operation only limits your access to the code on this browser.')}</p>
              </CodeRow>
            </Forget>
          )}
        </Card>
      </td>
      <td className='all top'>
        {contractAbi && (
          <Messages
            contractAbi={contractAbi}
            onSelectConstructor={_onDeployConstructor}
            withConstructors
          />
        )}
      </td>
      <td className='together codeHash'>
        <div>{`${code.json.codeHash.slice(0, 8)}…${code.json.codeHash.slice(-6)}`}</div>
        <CopyButton value={code.json.codeHash} />
      </td>
      <td className='start together'>
        {optCode && (
          optCode.isSome ? t('Available') : t('Not on-chain')
        )}
      </td>
      <td className='button'>
        <Button
          icon='trash'
          onClick={toggleIsForgetOpen}
        />
        {!contractAbi && (
          <Button
            icon='upload'
            label={t('deploy')}
            onClick={_onShowDeploy}
          />
        )}
      </td>
    </StyledTr>
  );
}

const StyledTr = styled.tr`
  .codeHash {
    div {
      display: inline;

      &:first-child {
        font-family: monospace;
        margin-right: 0.5rem;
      }
    }
  }
`;

export default React.memo(Code);
