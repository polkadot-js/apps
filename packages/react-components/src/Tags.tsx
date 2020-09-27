// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { VoidFn } from './types';

import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { classes } from './util';

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
  onSave?: VoidFn;
  value: string[];
}

function Tags ({ children, className, isEditable, isEditing, onChange, onSave, onToggleIsEditing, value }: Props): React.ReactElement<Props> {
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
    <div className={classes('ui--Tags', className)}>
      {isEditable && isEditing
        ? (
          <InputTags
            defaultValue={value}
            onBlur={_onSave}
            onChange={onChange}
            onClose={_onSave}
            openOnFocus
            searchInput={{ autoFocus: true }}
            value={value}
            withLabel={false}
          />
        )
        : (
          <div className='tags--toggle'>
            {isEditable
              ? (
                <EditButton onClick={onToggleIsEditing}>
                  {contents}
                </EditButton>
              )
              : contents}
          </div>
        )
      }
      {children}
    </div>
  );
}

export default React.memo(styled(Tags)`
  .tags--toggle {
    display: inline-block;

    label {
      display: inline-block !important;
    }
  }
`);
