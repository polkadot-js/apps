// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo } from 'react';

import EditButton from './EditButton.js';
import InputTags from './InputTags.js';
import { styled } from './styled.js';
import Tag from './Tag.js';
import { useTranslation } from './translate.js';

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
      : <div>{t('none')}</div>,
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
    <StyledDiv className={`${className} ui--Tags`}>
      {withTitle && (
        <h5>{t('Tags')}</h5>
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
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
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
`;

export default React.memo(Tags);
