// Copyright 2017-2020 @polkadot/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CodeStored } from '@polkadot/apps/types';
import { BareProps } from './types';

import React, { useCallback } from 'react';
import styled from 'styled-components';
import store from '@polkadot/apps/store';
import ItemInfo from './ItemInfo';
import { useNonEmptyString, useToggle } from '@polkadot/react-hooks';

import CopyButton from './CopyButton';
import EditButton from './EditButton';
import Icon from './Icon';
import Input from './Input';
import { useTranslation } from './translate';
import { truncate } from './util';

interface Props extends BareProps {
  code: CodeStored;
  isEditable?: boolean;
}

function CodeInfo ({ children, className, code: { id, json: { codeHash, name } }, isEditable }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [newName, setNewName, isNewNameValid, isNewNameError] = useNonEmptyString(name);
  const [isEditingName, toggleIsEditingName] = useToggle();

  const onSaveName = useCallback(
    (): void => {
      if (!isNewNameValid) {
        return;
      }
  
      store.saveCode(
        { name: newName },
        id
      );
      toggleIsEditingName();
    },
    [isNewNameValid, newName]
  );

  return (
    <ItemInfo
      className={className}
      icon={
        <Icon
          className='code-icon'
          name='file outline'
        />
      }
      subtitle={
        <>
          {t('Code hash')}
          {': '}
          <CopyButton value={codeHash}>
            {truncate(codeHash, 16)}
          </CopyButton>
        </>
      }
      title={
        isEditable && isEditingName
          ? (
            <Input
              autoFocus
              className='name-editor'
              isError={isNewNameError}
              onBlur={onSaveName}
              onEnter
              onChange={setNewName}
              withLabel={false}
              value={newName}
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
  )

  // return (
  //   <article className={cl}>
  //     <div className='content'>
  //       <Icon
  //         className='code-icon'
  //         name='file outline'
  //       />
  //       <div className='info'>
  //         <div className='title'>
  //           {isEditingName
  //             ? (
  //               <Input
  //                 autoFocus
  //                 className='name-editor'
  //                 isError={isNewNameError}
  //                 onBlur={onSaveName}
  //                 onEnter
  //                 onChange={setNewName}
  //                 withLabel={false}
  //                 value={newName}
  //               />
  //             )
  //             : (
  //               <EditButton onClick={toggleIsEditingName}>
  //                 {name}
  //               </EditButton>
  //             )}
  //         </div>
  //         <div className='subtitle'>
  //           {t('Code hash')}
  //           {': '}
  //           <CopyButton value={codeHash}>
  //             {truncate(codeHash, 16)}
  //           </CopyButton>
  //         </div>
  //         {
  //           isAbiSupplied
  //             ? (
  //               <Expander
  //                 isOpen={isAbiOpen}
  //                 onClick={toggleIsAbiOpen}
  //                 summary={t('ABI')}
  //               >
  //                 <Messages
  //                   contractAbi={contractAbi}
  //                   isLabelled={false}
  //                   isRemovable={false}
  //                   withConstructors
  //                 />
  //               </Expander>
  //             )
  //             : (
  //                 <InputABI
  //                   contractAbi={contractAbi}
  //                   errorText={errorText}
  //                   file={abiFile}
  //                   isError={isAbiError}
  //                   isSupplied={isAbiSupplied}
  //                   isValid={isAbiValid}
  //                   onChange={onChangeAbi}
  //                   onRemove={onRemoveAbi}
  //                   setFile={setAbiFile}
  //                   withLabel={false}
  //                 />
  //             )
  //         }
  //       </div>
  //     </div>
  //     <div className='footer'>
  //       <Button.Group>
  //         <Button
  //           isPrimary
  //           label={t('Deploy')}
  //           onClick={onDeploy}
  //         />
  //         <Button
  //           label={t('Forget')}
  //           onClick={onForget}
  //         />
  //       </Button.Group>
  //     </div>
  //   </article>
  // );
}

export default styled(React.memo(CodeInfo))`
  i.icon.code-icon {
    color: var(--grey60);
    font-size: 1.8rem;
    margin: 0.5rem;
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
`
