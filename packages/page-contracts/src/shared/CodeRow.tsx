// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CodeStored } from '@polkadot/app-contracts/types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { createType } from '@polkadot/types';
import { registry } from '@polkadot/react-api';
import { toShortAddress } from '@polkadot/react-components/util';
import Row from '@polkadot/react-components/Row';
import { CopyButton, Icon } from '@polkadot/react-components';

import contracts from '../store';

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
        contracts.saveCode(createType(registry, 'Hash', codeHash), { name })
          .catch((e): void => console.error(e));
      }
    },
    [codeHash, name]
  );

  const _onSaveTags = useCallback(
    (): void => {
      codeHash && contracts
        .saveCode(createType(registry, 'Hash', codeHash), { tags })
        .catch((e): void => console.error(e));
    },
    [codeHash, tags]
  );

  return (
    <Row
      address={
        <CopyButton
          isAddress
          value={codeHash}
        >
          <span>{toShortAddress(codeHash)}</span>
        </CopyButton>
      }
      buttons={buttons}
      className={className}
      icon={
        <div className='ui--CodeRow-icon'>
          <Icon
            icon='code'
            size='large'
          />
        </div>
      }
      isEditableName
      isEditableTags
      isInline={isInline}
      name={name}
      onChangeName={setName}
      onChangeTags={setTags}
      onSaveName={_onSaveName}
      onSaveTags={_onSaveTags}
      tags={withTags && tags}
    >
      {children}
    </Row>
  );
}

export default React.memo(
  styled(CodeRow)`
    .ui--CodeRow-icon {
      margin-right: 1em;
      background: #eee;
      color: #666;
      width: 4rem;
      height: 5rem;
      padding: 0.5rem;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
    }
  `
);
