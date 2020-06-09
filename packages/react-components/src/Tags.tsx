// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
  color?: 'green' | 'grey' | 'red';
  isEditable?: boolean;
  isEditing?: boolean;
  onChange?: (_: string[]) => void;
  onToggleIsEditing?: () => void;
  onSave?: VoidFn;
  size?: 'small' | 'tiny';
  value: string[];
}

function Tags ({ children, className, color = 'grey', isEditable, isEditing, onChange, onSave, onToggleIsEditing, size = 'small', value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const contents = useMemo(
    (): React.ReactNode => value.length
      ? value.map((tag): React.ReactNode => (
        <Tag
          color={color}
          key={tag}
          label={tag}
          size={size}
        />
      ))
      : <label>{t<string>('no tags')}</label>,
    [color, size, t, value]
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
