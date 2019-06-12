// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Label } from 'semantic-ui-react';
import React from 'react';
import { Button, Input, InputTags } from '@polkadot/ui-app';

import { classes } from './util';

export const styles = `
  text-align: left;

  &.inline {
    display: flex;

    .ui--Row-children {
      padding: 0 0 0 3rem;
    }
  }

  &.invalid {
    filter: grayscale(100);
    opacity: 0.5;
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
    flex: 0;
    margin: -0.75rem -0.75rem 0 0;
    white-space: nowrap;
  }

  .ui--Row-children {
    display: block;
    padding-top: 1rem;
  }

  .ui--Row-details {
    flex: 1;
    margin-right: 1rem;
    padding: 0.25rem 0 0;

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

  .ui--Row-name {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: normal;
  }

  .ui--Row-name-input {
    input {
      height: 1em;
      text-transform: uppercase;
      margin-top: -0.3em;
      margin-bottom: -0.35em;
    }
  }

  .ui--Row-tags {
    &.editable {
      display: flex;
      flex-wrap: wrap;
      justify-content: left;

      > span {
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

export type RowProps = {
  buttons?: React.ReactNode,
  children?: React.ReactNode,
  className?: string,
  defaultName?: string,
  extraInfo?: React.ReactNode,
  iconInfo?: React.ReactNode,
  isEditable?: boolean,
  isInline?: boolean,
  withIcon?: boolean,
  withTags?: boolean
};

export type RowState = {
  isEditingName: boolean,
  isEditingTags: boolean,
  name: string,
  tags: string[]
};

// const DEFAULT_ADDR = '5'.padEnd(16, 'x');
// const ICON_SIZE = 48;

class Row<P extends RowProps, S extends RowState> extends React.PureComponent<P, S> {
  state: S = {
    isEditingName: false,
    isEditingTags: false
  } as S;

  static defaultProps = {
    defaultName: '<unknown>'
  };

  protected onChangeName = (name: string) => {
    this.setState({ name });
  }

  protected onChangeTags = (tags: string[]) => {
    this.setState({ tags });
  }

  protected renderButtons () {
    const { buttons } = this.props;

    return buttons
      ? <div className='ui--Row-buttons'>{buttons}</div>
      : null;
  }

  protected renderChildren () {
    const { children } = this.props;

    const hasChildren = !children
      ? false
      : Array.isArray(children)
        ? children.filter((child) => child).length !== 0
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

  protected renderEditIcon () {
    return (
      <Button
        className='iconButton'
        icon='edit'
        size='mini'
        isPrimary
        key='unlock'
      />
    );
  }

  protected renderName () {
    const { isEditable } = this.props;
    const { isEditingName, name } = this.state;

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
          className={classes('ui--Row-name', isEditable && 'editable')}
          onClick={isEditable ? this.toggleNameEditor : undefined}
        >
          {name}
          {isEditable && this.renderEditIcon()}
        </div>
      );
  }

  protected renderTags () {
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
              : tags.map((tag) => (
                <Label key={tag} size='tiny' color='grey'>{tag}</Label>
              ))
          }
          {isEditable && this.renderEditIcon()}
        </div>
      );
  }

  protected saveName!: () => void;

  protected saveTags!: () => void;

  protected toggleNameEditor = () => {
    this.setState(({ isEditingName }) => ({
      isEditingName: !isEditingName
    }));
  }

  protected toggleTagsEditor = () => {
    this.setState(({ isEditingTags }) => ({
      isEditingTags: !isEditingTags
    }));
  }
}

export default Row;
