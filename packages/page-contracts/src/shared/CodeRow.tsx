// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/camelcase */

import { CodeStored } from '@polkadot/app-contracts/types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { createType } from '@polkadot/types';
import { registry } from '@polkadot/react-api';
import { toShortAddress } from '@polkadot/react-components/util';
import Row from '@polkadot/react-components/RowNew';
import { CopyButton, Icon } from '@polkadot/react-components';

import contracts from '../store';
import Messages from './Messages';

interface Props {
  buttons?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  code: CodeStored;
  isInline?: boolean;
  withTags?: boolean;
}

const DEFAULT_HASH = '0x';
const DEFAULT_NAME = '<unknown>';

// const CodeIcon = styled.div`
//   & {
//     margin-right: 1em;
//     background: #eee;
//     color: #666;
//     width: 4rem;
//     height: 5rem;
//     padding: 0.5rem;
//     display: flex;
//     justify-content: flex-end;
//     align-items: flex-end;
//   }
// `;

// const DEFAULT_ADDR = '5'.padEnd(16, 'x');

function CodeRow ({ buttons, children, className, code: { json }, isInline, withTags }: Props): React.ReactElement<Props> {
  const [name, setName] = useState(json.name || DEFAULT_NAME);
  const [tags, setTags] = useState(json.tags || []);
  const [codeHash, setCodeHash] = useState(json.codeHash || DEFAULT_HASH);

  useEffect((): void => {
    setName(json.name || DEFAULT_NAME);
    setTags(json.tags || []);
    setCodeHash(json.codeHash || DEFAULT_HASH);
  }, [json]);

  const _onSaveName = useCallback(
    (): void => {
      const trimmedName = name.trim();

      if (trimmedName && codeHash) {
        contracts.saveCode(createType(registry, 'Hash', codeHash), { name });
      }
    },
    [codeHash, name]
  );

  const _onSaveTags = useCallback(
    (): void => {
      if (codeHash) {
        contracts.saveCode(createType(registry, 'Hash', codeHash), { tags });
      }
    },
    [codeHash, tags]
  );

  return (
    <Row
      address={
        <CopyButton
          isAddress
          value={codeHash}
        >
          <span>{toShortAddress(codeHash)}</span>
        </CopyButton>
      }
      buttons={buttons}
      className={className}
      icon={
        <div className='ui--CodeRow-icon'>
          <Icon
            name='code'
            size='large'
          />
        </div>
      }
      isEditableName
      isEditableTags
      isInline={isInline}
      name={name}
      onChangeName={setName}
      onChangeTags={setTags}
      onSaveName={_onSaveName}
      onSaveTags={_onSaveTags}
      tags={withTags && tags}
    >
      {children}
    </Row>
  );
}

// class CodeRow2 extends Row<Props, State> {
//   public state: State;

//   constructor (props: Props) {
//     super(props);

//     this.state = this.createState();
//   }

//   public static getDerivedStateFromProps ({ accounts_info, code: { json } }: Props, prevState: State): State | null {
//     const codeHash = json.codeHash || DEFAULT_HASH;
//     const name = json.name || DEFAULT_NAME;
//     const tags = json.tags || [];
//     const { accountId } = accounts_info || {};
//     const address = accountId
//       ? accountId.toString()
//       : DEFAULT_ADDR;

//     const state: Partial<State> = { tags };
//     let hasChanged = false;

//     if (codeHash !== prevState.codeHash) {
//       state.codeHash = codeHash;
//       hasChanged = true;
//     }

//     if (!prevState.isEditingName && name !== prevState.name) {
//       state.name = name;
//       hasChanged = true;
//     }

//     if (address !== prevState.address) {
//       state.address = address;
//       hasChanged = true;
//     }

//     return hasChanged
//       ? state as State
//       : null;
//   }

//   public render (): React.ReactNode {
//     const { className, isInline, style } = this.props;

//     return (
//       <div
//         className={classes('ui--Row', isInline && 'inline', className)}
//         style={style}
//       >
//         <div className='ui--Row-base'>
//           {this.renderIcon()}
//           <div className='ui--Row-details'>
//             {this.renderName()}
//             {this.renderCodeHash()}
//             {this.renderTags()}
//           </div>
//           {this.renderButtons()}
//         </div>
//         {this.renderMessages()}
//         {this.renderChildren()}
//       </div>
//     );
//   }

//   private createState (): State {
//     const { code: { json: { codeHash = DEFAULT_HASH, name = DEFAULT_NAME, tags = [] } } } = this.props;

//     return {
//       address: DEFAULT_ADDR,
//       codeHash,
//       isEditingName: false,
//       isEditingTags: false,
//       name,
//       tags
//     };
//   }

//   protected renderCodeHash (): React.ReactNode {
//     const { codeHash } = this.state;

//     return (
//       <>
//         <div className='ui--Row-name'>
//           {name}
//         </div>
//         <div className='ui--Row-accountId'>
//           <CopyButton
//             isAddress
//             value={codeHash}
//           >
//             <span>{toShortAddress(codeHash)}</span>
//           </CopyButton>
//         </div>
//       </>
//     );
//   }

//   protected renderButtons (): React.ReactNode {
//     const { buttons } = this.props;

//     if (!buttons) {
//       return null;
//     }

//     return (
//       <div className='ui--Row-buttons'>
//         {buttons}
//       </div>
//     );
//   }

//   protected renderIcon (): React.ReactNode {
//     return (
//       <CodeIcon>
//         <Icon
//           name='code'
//           size='large'
//         />
//       </CodeIcon>
//     );
//   }

//   protected renderMessages (): React.ReactNode {
//     const { code: { contractAbi }, withMessages } = this.props;

//     if (!withMessages || !contractAbi) {
//       return null;
//     }

//     return (
//       <Messages
//         contractAbi={contractAbi}
//         isRemovable
//       />
//     );
//   }

//   protected saveName = async (): Promise<void> => {
//     const { codeHash, name } = this.state;
//     const trimmedName = name.trim();

//     // Save only if the name was changed or if it's no empty.
//     if (trimmedName && codeHash) {
//       await contracts.saveCode(createType(registry, 'Hash', codeHash), { name });

//       this.setState({ isEditingName: false });
//     }
//   }

//   protected saveTags = async (): Promise<void> => {
//     const { codeHash, tags } = this.state;

//     if (codeHash) {
//       await contracts.saveCode(createType(registry, 'Hash', codeHash), { tags });

//       this.setState({ isEditingTags: false });
//     }
//   }
// }

export default styled(CodeRow)`
  .ui--CodeRow-icon {
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
