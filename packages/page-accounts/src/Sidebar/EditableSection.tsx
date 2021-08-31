// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import styled from 'styled-components';

import EditAccountButton from '@polkadot/app-accounts/Sidebar/EditAccountButton';
import { useTranslation } from '@polkadot/app-accounts/translate';
import { AccountName, Input, Tags } from '@polkadot/react-components';
import ButtonCancel from '@polkadot/react-components/ButtonCancel';
import { useAccountInfo, useOutsideClick } from '@polkadot/react-hooks';

interface Props {
  address: string;
  onUpdateName: () => void;
  sidebarRef: React.RefObject<HTMLDivElement>;
}

function EditableSidebarSection ({ address, onUpdateName, sidebarRef }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { flags, isEditingName, isEditingTags, name, onCancel, onSaveName, onSaveTags, setName, setTags, tags, toggleIsEditingName, toggleIsEditingTags } = useAccountInfo(address);

  const isEditing = useCallback(() => isEditingName || isEditingTags, [isEditingName, isEditingTags]);

  const updateTags = useCallback(() => {
    onSaveTags();
  }, [onSaveTags]);

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
    if (isEditing()) {
      updateName();
      updateTags();
    }

    toggleIsEditing();
  }, [isEditing, toggleIsEditing, updateName, updateTags]);

  useOutsideClick([sidebarRef], onCancel);

  return (
    <>
      <AccountName
        override={
          isEditingName
            ? (
              <Input
                className='name--input'
                defaultValue={name}
                label='name-input'
                onChange={setName}
                withLabel={false}
              />
            )
            : flags.isEditable
              ? (name.toUpperCase() || t<string>('<unknown>'))
              : undefined
        }
        value={address}
        withSidebar={false}
      />
      <div
        className='ui--AddressMenu-tags'
        data-testid='sidebar-tags'
      >
        <Tags
          isEditable
          isEditing={isEditingTags}
          onChange={setTags}
          size='tiny'
          value={tags}
          withIcon={false}
          withTitle
        />
      </div>
      {isEditing() && <ButtonCancel onClick={onCancel}/>}
      <EditAccountButton
        isEditing={isEditing}
        onClick={onEdit}
      />
    </>
  );
}

export default React.memo(styled(EditableSidebarSection)`
  .ui--AddressMenu-tags {
    margin: 0.75rem 0 0;
    width: 100%;
  }
`);
