// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { KeyringItemType } from '@polkadot/ui-keyring/types';

import { Label } from 'semantic-ui-react';
import React from 'react';

import Button from './Button';
import { classes, toShortAddress } from './util';
import CopyButton from './CopyButton';
import Input from './Input';
import InputTags from './InputTags';

export const styles = `
  text-align: left;

  &.disabled {
    filter: grayscale(100%);
    opacity: 0.6;
  }

  &.inline {
    display: flex;

    .ui--Row-accountId {
      white-space: nowrap;
    }
  }

  &.invalid {
    .ui--Row-accountId,
    .ui--Row-icon {
      filter: grayscale(100);
      opacity: 0.5;
    }
  }

  button.ui.icon.editButton {
    padding: 0em .3em .3em .3em;
    color: #2e86ab;
    background: none;
    /*trick to let the button in the flow but keep the content centered regardless*/
    margin-left: -2em;
    position: relative;
    right: -2.3em;
    z-index: 1;
  }

  .editSpan {
    white-space: nowrap;

    &:before {
      content: '';
    }
  }

  .ui--Row-accountId,
  .ui--Row-accountIndex {
    font-family: monospace;
    font-size: 1.25em;
    padding: 0;
    margin-bottom: 0.25rem;
  }

  .ui--Row-accountIndex {
    font-style: italic;
  }

  .ui--Row-balances {
    display: flex;
    .column {
      display: block;

      label,
      .result {
        display: inline-block;
      }
    }

    > span {
      text-align: left;
    }
  }

  .ui--Row-base {
    display: flex;
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

  .ui--Row-address-or-name {
    display: flex;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;

    .withName {
      white-space: nowrap;
      text-transform: uppercase;
      overflow: hidden;
      text-overflow: inherit;
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
  accounts_info?: DeriveAccountInfo;
  buttons?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  defaultName?: string;
  extraInfo?: React.ReactNode;
  iconInfo?: React.ReactNode;
  isEditable?: boolean;
  isInline?: boolean;
  type?: KeyringItemType;
  withIcon?: boolean;
  withTags?: boolean;
}

export interface RowState {
  address: string;
  isEditingName: boolean;
  isEditingTags: boolean;
  name: string;
  tags: string[];
}

// const DEFAULT_ADDR = '5'.padEnd(16, 'x');
// const ICON_SIZE = 48;

export default class Row<P extends RowProps, S extends RowState> extends React.PureComponent<P, S> {
  public state: S = {
    isEditingName: false,
    isEditingTags: false
  } as unknown as S;

  public static defaultProps = {
    defaultName: '<unknown>'
  };

  protected onChangeName = (name: string): void => {
    this.setState({ name });
  }

  protected onChangeTags = (tags: string[]): void => {
    this.setState({ tags });
  }

  protected renderButtons (): React.ReactNode {
    const { buttons } = this.props;

    return buttons
      ? <div className='ui--Row-buttons'>{buttons}</div>
      : null;
  }

  protected renderChildren (): React.ReactNode {
    const { children } = this.props;
    const hasChildren = !children
      ? false
      : Array.isArray(children)
        ? children.filter((child): boolean => !!child).length !== 0
        : true;

    if (!hasChildren) {
      return null;
    }

    return (
      <div className='ui--Row-children'>
        {children}
      </div>
    );
  }

  protected renderEditIcon (): React.ReactNode {
    return (
      <span className='editSpan'>
        <Button
          className='icon-button'
          icon='edit'
          size='mini'
          isPrimary
          key='unlock'
        />
      </span>

    );
  }

  protected renderName (withCopy = false): React.ReactNode {
    const { defaultName, isEditable } = this.props;
    const { address, isEditingName, name } = this.state;
    const withName = name !== defaultName;

    // can't be both editable and copyable
    return isEditingName
      ? (
        <Input
          autoFocus
          className='ui--Row-name-input'
          defaultValue={name}
          onBlur={this.saveName}
          onChange={this.onChangeName}
          onEnter={this.saveName}
          withLabel={false}
        />
      )
      : (
        <div
          className={classes('ui--Row-address-or-name', isEditable && 'editable')}
          onClick={isEditable ? this.toggleNameEditor : undefined}
        >
          {withCopy && !isEditable
            ? (
              <CopyButton
                isAddress
                value={address}
              >
                <span className={`${withName ? 'withName' : 'withAddr'}`}>{
                  withName ? name : toShortAddress(address)
                }
                </span>
              </CopyButton>
            )
            : (
              <>
                <span className='withName'>
                  {name}
                </span>
                {isEditable && this.renderEditIcon()}
              </>
            )
          }
        </div>
      );
  }

  protected renderTags (): React.ReactNode {
    const { isEditingTags, tags } = this.state;
    const { isEditable, withTags = false } = this.props;

    if (!withTags) {
      return null;
    }

    return isEditingTags
      ? (
        <InputTags
          className='ui--Row-tags-input'
          onBlur={this.saveTags}
          onChange={this.onChangeTags}
          onClose={this.saveTags}
          openOnFocus
          defaultValue = {tags}
          searchInput={{ autoFocus: true }}
          value={tags}
          withLabel={false}
        />
      )
      : (
        <div
          className={classes('ui--Row-tags', isEditable && 'editable')}
          onClick={isEditable ? this.toggleTagsEditor : undefined}
        >
          {
            !tags.length
              ? (isEditable ? <span className='addTags'>add tags</span> : undefined)
              : tags.map((tag): React.ReactNode => (
                <Label key={tag} size='tiny' color='grey'>{tag}</Label>
              ))
          }
          {isEditable && this.renderEditIcon()}
        </div>
      );
  }

  protected saveName!: () => void;

  protected saveTags!: () => void;

  protected toggleNameEditor = (): void => {
    this.setState(({ isEditingName }): S => ({
      isEditingName: !isEditingName
    }) as unknown as S);
  }

  protected toggleTagsEditor = (): void => {
    this.setState(({ isEditingTags }): S => ({
      isEditingTags: !isEditingTags
    }) as unknown as S);
  }
}
