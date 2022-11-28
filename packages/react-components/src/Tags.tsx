// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

import EditButton from './EditButton';
import InputTags from './InputTags';
import Tag from './Tag';
import { useTranslation } from './translate';

interface Props {
  children?: React.ReactNode;
  className?: string;
  isEditable?: boolean;
  isEditing?: boolean;
  onChange?: (_: string[]) => void;
  onToggleIsEditing?: () => void;
  onSave?: () => void;
  value: string[];
  withEditButton?: boolean;
  withTitle?: boolean;
}

function Tags ({ children, className = '', isEditable, isEditing, onChange, onSave, onToggleIsEditing, value, withEditButton = true, withTitle }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const contents = useMemo(
    () => value.length
      ? value.map((tag): React.ReactNode => (
        <Tag
          key={tag}
          label={tag}
        />
      ))
      : <label>{t<string>('no tags')}</label>,
    [t, value]
  );

  const _onSave = useCallback(
    (): void => {
      onSave && onSave();
      onToggleIsEditing && onToggleIsEditing();
    },
    [onSave, onToggleIsEditing]
  );

  return (
    <div className={`ui--Tags ${className}`}>
      {withTitle && (
        <h5>{t<string>('Tags')}</h5>
      )}
      {isEditable && isEditing
        ? (
          <InputTags
            defaultValue={value}
            onBlur={_onSave}
            onChange={onChange}
            onClose={_onSave}
            openOnFocus
            searchInput={{ autoFocus: false }}
            value={value}
            withLabel={false}
          />
        )
        : isEditable && withEditButton
          ? (
            <EditButton
              className={value.length === 0 ? 'center' : 'left'}
              onClick={onToggleIsEditing}
            >
              {contents}
            </EditButton>
          )
          : contents
      }
      {children}
    </div>
  );
}

export default React.memo(styled(Tags)`
  h5 {
    font-style: normal;
    font-weight: var(--font-weight-bold);
    font-size: 0.714rem;
    line-height: 1rem;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  label {
    display: inline-block;
  }

  .ui--EditButton {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    &.center {
      justify-content: center;
    }

    &.left {
      justify-content: left;
    }
  }

  .ui--Tag {
    margin: 0.1rem 0 0.1rem 0.571rem;
  }
`);
