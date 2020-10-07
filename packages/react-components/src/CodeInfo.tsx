// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Code } from '@canvas-ui/apps/types';
import { BareProps } from './types';

import React, { useCallback } from 'react';
import styled from 'styled-components';
import store from '@canvas-ui/apps/store';
import ItemInfo from './ItemInfo';
import { useNonEmptyString, useToggle } from '@canvas-ui/react-hooks';

import CopyButton from './CopyButton';
import EditButton from './EditButton';
import Icon from './Icon';
import Input from './Input';
import { useTranslation } from './translate';
import { truncate } from '@canvas-ui/react-util';

interface Props extends BareProps {
  code: Code;
  isEditable?: boolean;
}

function CodeInfo ({ children, className, code: { codeHash, id, name }, isEditable }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [newName, setNewName, isNewNameValid, isNewNameError] = useNonEmptyString(name);
  const [isEditingName, toggleIsEditingName] = useToggle();

  const onSaveName = useCallback(
    (): void => {
      if (!isNewNameValid) {
        return;
      }

      store.saveCode(
        { name: newName },
        id
      )
        .then(toggleIsEditingName)
        .catch((e): void => {
          console.error(e);
        });
    },
    [id, isNewNameValid, newName, toggleIsEditingName]
  );

  return (
    <ItemInfo
      className={className}
      icon={
        <Icon
          className='code-icon'
          name='file outline'
        />
      }
      subtitle={
        <>
          {t<string>('Code hash')}
          {': '}
          <CopyButton value={codeHash}>
            {truncate(codeHash || '', 16)}
          </CopyButton>
        </>
      }
      title={
        isEditable && isEditingName
          ? (
            <Input
              autoFocus
              className='name-editor'
              isError={isNewNameError}
              onBlur={onSaveName}
              onChange={setNewName}
              onEnter
              value={newName}
              withLabel={false}
            />
          )
          : (
            isEditable
              ? (
                <EditButton onClick={toggleIsEditingName}>
                  {name}
                </EditButton>
              )
              : name
          )
      }
    >
      {children}
    </ItemInfo>
  );
}

export default styled(React.memo(CodeInfo))`
  i.icon.code-icon {
    color: var(--grey60);
    font-size: 1.8rem;
    margin: 0.5rem;
  }

  .name-editor {
    background: var(--grey15);

    .ui.input {
      margin: 0;

      > input {
        padding: 0;
      }
    }
  }
`;
