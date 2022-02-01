// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import styled from 'styled-components';

import { useToggle } from '@polkadot/react-hooks';

import EditButton from './EditButton';
import Input from './Input';
import Tags from './Tags';

export const styles = `
  text-align: left;

  &.isDisabled {
    opacity: 0.6;

    .ui--IdentityIcon  {
      filter: grayscale(100%);
    }
  }

  &.isInline {
    display: flex;

    .ui--Row-accountId {
      white-space: nowrap;
    }
  }

  &.isInvalid {
    .ui--Row-accountId,
    .ui--Row-icon {
      filter: grayscale(100);
      opacity: 0.5;
    }
  }

  .ui--Row-base {
    display: flex;
    min-width: 16rem;
  }

  .ui--Row-buttons {
    position: relative;
    margin-right: -0.5rem;
    margin-top: -0.5rem;
    white-space: nowrap;
    height: 0rem;
    overflow: visible;

    button.ui.button:last-child {
      margin-right: 0;
    }
  }

  .ui--Row-children {
    display: block;
    padding-left: 1rem;
    padding-top: 1rem;
  }

  .ui--Row-details {
    flex: 1;
    margin-right: 1rem;
    padding: 0.25rem 0 0;
    width: 100%;
    min-width: 0;

    .account-label{
      margin: -0.75rem 0 0 0
    }

    * {
      vertical-align: middle;
    }
  }

  .ui--Row-address,
  .ui--Row-accountIndex {
    font-family: monospace;
    font-size: 1.25em;
    padding: 0;
    margin-bottom: 0.25rem;
  }

  .ui--Row-name {
    display: flex;
    box-sizing: border-box;
    height: 1.5rem;
    margin: 0;
    padding: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-transform: uppercase;
    overflow: hidden;
    text-overflow: inherit;
  }

  .ui--Row-icon {
    flex: 0;
    margin-right: 1em;
    position: relative;

    .ui--Row-icon-info {
      left: -0.5rem;
      position: absolute;
      top: -0.5rem;
    }
  }

  .ui--Row-name-input {
    input {
      height: 1em;
      text-transform: uppercase;
      margin-top: -0.3em;
    }
  }

  .ui--Row-tags {
    &.editable {
      display: flex;
      flex-wrap: wrap;
      justify-content: left;

      .addTags {
        border: 1px #00000052 solid;
        border-radius: .5em;
        border-style: dashed;
        color: grey;
        font-size: x-small;
        padding: .1em 0.3em 0.1em 0.3em;
        margin-top: .2em;
      }

      > div.label {
        margin-top:.3em
      }
    }
  }

  .ui--Row-tags-input {
    margin-bottom: -1.4em;
  }
`;

export interface RowProps {
  address?: string;
  buttons?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  defaultName?: string;
  details?: React.ReactNode;
  icon?: React.ReactNode;
  iconInfo?: React.ReactNode;
  isDisabled?: boolean;
  isInline?: boolean;
  isEditableName?: boolean;
  isEditableTags?: boolean;
  name?: string;
  onChangeName?: (_: string) => void;
  onChangeTags?: (_: string[]) => void;
  onSaveName?: () => void;
  onSaveTags?: () => void;
  tags?: string[];
}

function Row ({ address, buttons, children, className = '', defaultName, details, icon, iconInfo, isDisabled, isEditableName, isEditableTags, isInline, name, onChangeName, onChangeTags, onSaveName, onSaveTags, tags }: RowProps): React.ReactElement<RowProps> {
  const [isEditingName, toggleIsEditingName] = useToggle();
  const [isEditingTags, toggleIsEditingTags] = useToggle();

  const _onSaveName = useCallback((): void => {
    onSaveName && onSaveName();
    toggleIsEditingName();
  }, [onSaveName, toggleIsEditingName]);

  return (
    <div
      className={`ui--Row${isDisabled ? ' isDisabled' : ''}${isInline ? ' isInline' : ''} ${className}`}
    >
      <div className='ui--Row-base'>
        {icon && (
          <div className='ui--Row-icon'>
            {icon}
            {iconInfo && (
              <div className='ui--Row-icon-info'>
                {iconInfo}
              </div>
            )}
          </div>
        )}
        <div className='ui--Row-details'>
          {(name || defaultName) && (
            isEditableName && isEditingName
              ? (
                <Input
                  autoFocus
                  defaultValue={name || defaultName}
                  isInPlaceEditor
                  onBlur={_onSaveName}
                  onChange={onChangeName}
                  onEnter
                  withLabel={false}
                />
              )
              : (
                <div className='ui--Row-name'>
                  {
                    isEditableName
                      ? (
                        <EditButton onClick={toggleIsEditingName}>
                          {name || defaultName}
                        </EditButton>
                      )
                      : name || defaultName
                  }
                </div>
              )
          )}
          {address && (
            <div className='ui--Row-address'>
              {address}
            </div>
          )}
          {details}
          {tags && (
            <Tags
              className='ui--Row-tags'
              isEditable={isEditableTags}
              isEditing={isEditingTags}
              onChange={onChangeTags}
              onSave={onSaveTags}
              onToggleIsEditing={toggleIsEditingTags}
              size='tiny'
              value={tags}
            />
          )}
        </div>
        {buttons && (
          <div className='ui--Row-buttons'>
            {buttons}
          </div>
        )}
      </div>
      {children && (
        <div className='ui--Row-children'>
          {children}
        </div>
      )}
    </div>
  );
}

export default React.memo(
  styled(Row)`${
    styles
  }`
);
