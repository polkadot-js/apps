// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { CodeStored } from '@polkadot/app-contracts/types';

import { Label } from 'semantic-ui-react';
import React from 'react';
import styled from 'styled-components';
import { Button, CopyButton, Icon, Input, InputTags, Messages } from '@polkadot/ui-app';
import { classes, toShortAddress } from '@polkadot/ui-app/util';
import contracts from '@polkadot/app-contracts/store';

import translate from './translate';

export type Props = I18nProps & {
  code: CodeStored,
  buttons?: React.ReactNode,
  isEditable?: boolean,
  withButtons?: boolean,
  withMessages?: boolean,
  withTags?: boolean
};

type State = {
  codeHash: string,
  isEditingName: boolean,
  isEditingTags: boolean,
  name: string,
  tags: string[]
};

const DEFAULT_HASH = '0x';
const DEFAULT_NAME = '<unknown>';

const CodeIcon = styled.div`
  & {
    margin-right: 1em;
    background: #eee;
    color: #666;
    min-width: 4rem;
    max-height: 5rem;
    padding: 0.5rem;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }
`;

class CodeSummary extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.createState();
  }

  static getDerivedStateFromProps ({ code: { json } }: Props, prevState: State): State | null {

    const codeHash = json.codeHash || DEFAULT_HASH;
    const name = json.name || DEFAULT_NAME;
    const tags = json.tags || [];

    const state = { tags } as State;
    let hasChanged = false;

    if (codeHash !== prevState.codeHash) {
      state.codeHash = codeHash;
      hasChanged = true;
    }

    if (!prevState.isEditingName && name !== prevState.name) {
      state.name = name;
      hasChanged = true;
    }

    return hasChanged
      ? state
      : null;
  }

  render () {
    const { className, style } = this.props;

    return (
      <div className='ui--AddressRow'>
        <div
          className={classes('ui--AddressRow-base', 'inline', className)}
          style={style}
        >
          {this.renderIcon()}
          {this.renderButtons()}
          <div className='ui--AddressRow-details'>
            <div className='ui--AddressSummary-data'>
              {this.renderName()}
              {this.renderCodeHash()}
            </div>
            {this.renderTags()}
          </div>
        </div>
        {this.renderMessages()}
        {this.renderChildren()}
      </div>
    );
  }

  private createState () {
    const { code: { json: { codeHash = DEFAULT_HASH, name = DEFAULT_NAME, tags = [] } } } = this.props;

    return {
      codeHash,
      isEditingName: false,
      isEditingTags: false,
      name,
      tags
    };
  }

  protected renderCodeHash () {
    const { codeHash } = this.state;

    return (
      <>
        <div className='ui--AddressSummary-name'>
          {name}
        </div>
        <div className='ui--AddressSummary-accountId'>
          <CopyButton
            isAddress
            value={codeHash}
          >
            <span>{toShortAddress(codeHash)}</span>
          </CopyButton>
        </div>
      </>
    );
  }

  protected renderButtons () {
    const { buttons } = this.props;

    if (!buttons) {
      return null;
    }

    return (
      <div className='ui--AddressSummary-buttons'>
        {buttons}
      </div>
    );
  }

  protected renderName () {
    const { isEditable } = this.props;
    const { isEditingName, name } = this.state;

    return isEditingName
      ? (
        <Input
          autoFocus
          defaultValue={name}
          onBlur={this.saveName}
          onChange={this.onChangeName}
          onEnter={this.saveName}
          withLabel={false}
        />
      )
      : (
        <div
          className={classes('ui--AddressSummary-name', 'editable')}
          onClick={isEditable ? this.toggleNameEditor : undefined}
        >
          {name}
          {isEditable && this.renderEditIcon()}
        </div>
      );
  }

  protected onChangeName = (name: string) => {
    this.setState({ name });
  }

  protected onChangeTags = (tags: string[]) => {
    this.setState({ tags });
  }

  protected renderChildren () {
    const { children } = this.props;

    if (!children || (Array.isArray(children) && children.length === 0)) {
      return null;
    }

    return (
      <div className='ui--AddressSummary-children'>
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

  protected renderIcon (className: string = 'ui--AddressRow-icon') {
    return (
      <CodeIcon>
        <Icon
          className={className}
          name='code'
          size='large'
        />
      </CodeIcon>
    );
  }

  protected renderSaveIcon (callback: () => void) {
    return (
      <Button
        className='saveButton'
        onClick={callback}
        icon='save'
        size='small'
        isPrimary
        key='save'
      />
    );
  }

  protected renderTags () {
    const { isEditable, withTags } = this.props;
    const { isEditingTags, tags } = this.state;

    if (!withTags) {
      return null;
    }

    const resultingDom = isEditingTags ?
      <>
        <InputTags
          className='ui--AddressSummary-tags-input'
          onBlur={this.saveTags}
          onChange={this.onChangeTags}
          onClose={this.saveTags}
          openOnFocus
          defaultValue = {tags}
          searchInput={{ autoFocus: true }}
          value={tags}
          withLabel={false}
        />
      </>
       :
        <div
          className={classes('ui--AddressSummary-tags', 'editable')}
          onClick={isEditable ? this.toggleTagsEditor : undefined}
        >
          {
            !tags.length
              ? <span className='addTags'>add tags</span>
              : tags.map((tag) => {
                return (
                  <Label key={tag} size='tiny' color='grey'>
                    {tag}
                  </Label>
                );
              })
          }
          {isEditable && this.renderEditIcon()}
        </div>;

    return resultingDom;
  }

  protected renderMessages () {
    const { code: { contractAbi }, withMessages } = this.props;

    if (!withMessages || !contractAbi) {
      return null;
    }

    return (
      <Messages
        contractAbi={contractAbi!}
        isRemovable
      />
    );
  }

  protected saveName = () => {
    const { codeHash, name } = this.state;
    const trimmedName = name.trim();

    // Save only if the name was changed or if it's no empty.
    if (trimmedName && codeHash) {
      contracts.saveCode(new Hash(codeHash), { name });

      this.setState({ isEditingName: false });
    }
  }

  protected saveTags = () => {
    const { codeHash, tags } = this.state;

    if (codeHash) {
      contracts.saveCode(new Hash(codeHash), { tags });

      this.setState({ isEditingTags: false });
    }
  }

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

export default translate(CodeSummary);
