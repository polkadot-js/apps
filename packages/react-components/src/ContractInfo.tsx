// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

// import { PromiseContract as Contract } from '@canvas-ui/api-contract';
// import { CodeStored } from '@canvas-ui/apps/types';
import { BareProps } from './types';

import React from 'react';
import styled from 'styled-components';
import ItemInfo from './ItemInfo';
import { IdentityIcon } from '@canvas-ui/react-components';
import { useAccountInfo } from '@canvas-ui/react-hooks';
import { truncate } from '@canvas-ui/react-util';

import CopyButton from './CopyButton';
import EditButton from './EditButton';
import Input from './Input';
 
interface Props extends BareProps {
  address: string;
  isEditable?: boolean;
}

function ContractInfo ({ address, children, className, isEditable }: Props): React.ReactElement<Props> {
  const { isEditingName, name, onSaveName, setName, toggleIsEditingName } = useAccountInfo(address, true);

  return (
    <ItemInfo
      className={className}
      icon={
        <IdentityIcon
          className='contract-icon'
          size={32}
          value={address}
        />
      }
      subtitle={
        <CopyButton
          isAddress
          value={address.toString()}
        >
          {truncate(address.toString(), 16)}
        </CopyButton>
      }
      title={
        isEditable && isEditingName
          ? (
            <Input
              autoFocus
              className='name-editor'
              isError={name === ''}
              onBlur={onSaveName}
              onChange={setName}
              onEnter
              value={name}
              withLabel={false}
            />
          )
          : (
            isEditable
              ? (
                <EditButton onClick={toggleIsEditingName}>
                  {name}
                </EditButton>
              )
              : name
          )
      }
    >
      {children}
    </ItemInfo>
  );
}

export default styled(React.memo(ContractInfo))`
  .contract-icon {
    margin: 0.5rem 0.5rem 0 0;

    .container:before {
      box-shadow: none !important;
      background-color: var(--white);
    }
  }

  .name-editor {
    background: var(--grey15);

    .ui.input {
      margin: 0;

      > input {
        padding: 0;
      }
    }
  }
`;
