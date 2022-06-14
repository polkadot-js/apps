// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import styled from 'styled-components';

import Transfer from '@polkadot/app-accounts/modals/Transfer';
import { useTranslation } from '@polkadot/app-accounts/translate';
import { Button } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { AddressFlags } from '@polkadot/react-hooks/types';
import { isFunction } from '@polkadot/util';

interface Props {
  className?: string;
  flags: AddressFlags;
  isEditingName: boolean;
  isEditing: boolean;
  toggleIsEditingName: () => void;
  toggleIsEditingTags: () => void;
  onCancel: () => void;
  onSaveName: () => void;
  onSaveTags: () => void;
  onForgetAddress: () => void;
  onUpdateName: () => void;
  recipientId: string;
}

function AccountMenuButtons ({ className = '', flags, isEditing, isEditingName, onCancel, onForgetAddress, onSaveName, onSaveTags, onUpdateName, recipientId, toggleIsEditingName, toggleIsEditingTags }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isTransferOpen, toggleIsTransferOpen] = useToggle();
  const api = useApi();

  const _onForgetAddress = useCallback(
    (): void => {
      onForgetAddress();
      onUpdateName && onUpdateName();
    },
    [onForgetAddress, onUpdateName]
  );

  const toggleIsEditing = useCallback(() => {
    flags.isEditable && toggleIsEditingName();
    toggleIsEditingTags();
  }, [flags.isEditable, toggleIsEditingName, toggleIsEditingTags]);

  const _onUpdateName = useCallback(
    (): void => {
      onSaveName();
      onUpdateName && onUpdateName();
    },
    [onSaveName, onUpdateName]
  );

  const updateName = useCallback(() => {
    if (isEditingName && (flags.isInContacts || flags.isOwned)) {
      _onUpdateName();
      toggleIsEditingName();
    }
  }, [isEditingName, flags.isInContacts, flags.isOwned, _onUpdateName, toggleIsEditingName]);

  const onEdit = useCallback(() => {
    if (isEditing) {
      updateName();
      onSaveTags();
    }

    toggleIsEditing();
  }, [isEditing, toggleIsEditing, updateName, onSaveTags]);

  return (
    <div className={`${className} ui--AddressMenu-buttons`}>
      {isEditing
        ? (
          <Button.Group>
            <Button
              icon='times'
              label={t<string>('Cancel')}
              onClick={onCancel}
            />
            <Button
              icon='save'
              label={t<string>('Save')}
              onClick={onEdit}
            />
          </Button.Group>
        )
        : (
          <Button.Group>
            {isFunction(api.api.tx.balances?.transfer) && (
              <Button
                icon='paper-plane'
                isDisabled={isEditing}
                label={t<string>('Send')}
                onClick={toggleIsTransferOpen}
              />
            )}
            {!flags.isOwned && !flags.isInContacts && (
              <Button
                icon='plus'
                isDisabled={isEditing}
                label={t<string>('Save')}
                onClick={_onUpdateName}
              />
            )}
            {!flags.isOwned && flags.isInContacts && (
              <Button
                icon='ban'
                isDisabled={isEditing}
                label={t<string>('Remove')}
                onClick={_onForgetAddress}
              />
            )}
            <Button
              icon='edit'
              isDisabled={!flags.isEditable}
              label={t<string>('Edit')}
              onClick={onEdit}
            />
          </Button.Group>
        )
      }
      {isTransferOpen && (
        <Transfer
          key='modal-transfer'
          onClose={toggleIsTransferOpen}
          recipientId={recipientId}
        />
      )}
    </div>
  );
}

export default React.memo(styled(AccountMenuButtons)`
  width: 100%;

  .ui--Button-Group {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-bottom: 0;
  }
`);
