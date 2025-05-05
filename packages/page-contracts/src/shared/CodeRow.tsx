// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CodeStored } from '../types.js';

import React, { useCallback, useEffect, useState } from 'react';

import { Icon, styled } from '@polkadot/react-components';
import Row from '@polkadot/react-components/Row';

import contracts from '../store.js';

interface Props {
  buttons?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  code: CodeStored;
  isInline?: boolean;
  withTags?: boolean;
}

const DEFAULT_HASH = '0x';
const DEFAULT_NAME = '<unknown>';

function CodeRow ({ buttons, children, className, code: { json }, isInline, withTags }: Props): React.ReactElement<Props> {
  const [name, setName] = useState(json.name || DEFAULT_NAME);
  const [tags, setTags] = useState(json.tags || []);
  const [codeHash, setCodeHash] = useState(json.codeHash || DEFAULT_HASH);

  useEffect((): void => {
    setName(json.name || DEFAULT_NAME);
    setTags(json.tags || []);
    setCodeHash(json.codeHash || DEFAULT_HASH);
  }, [json]);

  const _onSaveName = useCallback(
    (): void => {
      const trimmedName = name.trim();

      if (trimmedName && codeHash) {
        contracts.saveCode(codeHash, { name });
      }
    },
    [codeHash, name]
  );

  const _onSaveTags = useCallback(
    (): void => {
      codeHash && contracts.saveCode(codeHash, { tags });
    },
    [codeHash, tags]
  );

  return (
    <StyledRow
      buttons={buttons}
      className={className}
      icon={
        <div className='ui--CodeRow-icon'>
          <Icon icon='code' />
        </div>
      }
      isInline={isInline}
      name={name}
      onChangeName={setName}
      onChangeTags={setTags}
      onSaveName={_onSaveName}
      onSaveTags={_onSaveTags}
      tags={withTags ? tags : undefined}
    >
      {children}
    </StyledRow>
  );
}

const StyledRow = styled(Row)`
  .ui--CodeRow-icon {
    margin-right: -0.5em;
    background: #eee;
    border-radius: 50%;
    color: #666;
    width: 26px;
    height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default React.memo(CodeRow);
