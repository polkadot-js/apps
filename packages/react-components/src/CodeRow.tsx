/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { CodeStored } from '@polkadot/app-contracts/types';

import React from 'react';
import styled from 'styled-components';
import { createType } from '@polkadot/types';
import { withMulti } from '@polkadot/react-api';
import { classes, toShortAddress } from '@polkadot/react-components/util';
import contracts from '@polkadot/app-contracts/store';

import CopyButton from './CopyButton';
import Icon from './Icon';
import Messages from './Messages';

import Row, { RowProps, RowState, styles } from './Row';
import translate from './translate';

interface Props extends I18nProps, RowProps {
  code: CodeStored;
  withMessages?: boolean;
}

interface State extends RowState {
  codeHash: string;
}

const DEFAULT_HASH = '0x';
const DEFAULT_NAME = '<unknown>';

const CodeIcon = styled.div`
  & {
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
`;

const DEFAULT_ADDR = '5'.padEnd(16, 'x');

class CodeRow extends Row<Props, State> {
  public state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.createState();
  }

  public static getDerivedStateFromProps ({ code: { json }, accounts_info }: Props, prevState: State): State | null {
    const codeHash = json.codeHash || DEFAULT_HASH;
    const name = json.name || DEFAULT_NAME;
    const tags = json.tags || [];
    const { accountId } = accounts_info || {};
    const address = accountId
      ? accountId.toString()
      : DEFAULT_ADDR;

    const state: Partial<State> = { tags };
    let hasChanged = false;

    if (codeHash !== prevState.codeHash) {
      state.codeHash = codeHash;
      hasChanged = true;
    }

    if (!prevState.isEditingName && name !== prevState.name) {
      state.name = name;
      hasChanged = true;
    }

    if (address !== prevState.address) {
      state.address = address;
      hasChanged = true;
    }

    return hasChanged
      ? state as State
      : null;
  }

  public render (): React.ReactNode {
    const { className, isInline, style } = this.props;

    return (
      <div
        className={classes('ui--Row', isInline && 'inline', className)}
        style={style}
      >
        <div className='ui--Row-base'>
          {this.renderIcon()}
          <div className='ui--Row-details'>
            {this.renderName()}
            {this.renderCodeHash()}
            {this.renderTags()}
          </div>
          {this.renderButtons()}
        </div>
        {this.renderMessages()}
        {this.renderChildren()}
      </div>
    );
  }

  private createState (): State {
    const { code: { json: { codeHash = DEFAULT_HASH, name = DEFAULT_NAME, tags = [] } } } = this.props;

    return {
      address: DEFAULT_ADDR,
      codeHash,
      isEditingName: false,
      isEditingTags: false,
      name,
      tags
    };
  }

  protected renderCodeHash (): React.ReactNode {
    const { codeHash } = this.state;

    return (
      <>
        <div className='ui--Row-name'>
          {name}
        </div>
        <div className='ui--Row-accountId'>
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

  protected renderButtons (): React.ReactNode {
    const { buttons } = this.props;

    if (!buttons) {
      return null;
    }

    return (
      <div className='ui--Row-buttons'>
        {buttons}
      </div>
    );
  }

  protected renderIcon (): React.ReactNode {
    return (
      <CodeIcon>
        <Icon
          name='code'
          size='large'
        />
      </CodeIcon>
    );
  }

  protected renderMessages (): React.ReactNode {
    const { code: { contractAbi }, withMessages } = this.props;

    if (!withMessages || !contractAbi) {
      return null;
    }

    return (
      <Messages
        contractAbi={contractAbi}
        isRemovable
      />
    );
  }

  protected saveName = async (): Promise<void> => {
    const { codeHash, name } = this.state;
    const trimmedName = name.trim();

    // Save only if the name was changed or if it's no empty.
    if (trimmedName && codeHash) {
      await contracts.saveCode(createType('Hash', codeHash), { name });

      this.setState({ isEditingName: false });
    }
  }

  protected saveTags = async (): Promise<void> => {
    const { codeHash, tags } = this.state;

    if (codeHash) {
      await contracts.saveCode(createType('Hash', codeHash), { tags });

      this.setState({ isEditingTags: false });
    }
  }
}

export default withMulti(
  styled(CodeRow as React.ComponentClass<Props>)`
    ${styles}
  `,
  translate
);
