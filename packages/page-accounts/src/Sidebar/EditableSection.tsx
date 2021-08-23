// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import styled from 'styled-components';

import EditAccountButton from '@polkadot/app-accounts/Sidebar/EditAccountButton';
import { useTranslation } from '@polkadot/app-accounts/translate';
import { AccountName, Input, Tags } from '@polkadot/react-components';
import { useAccountInfo } from '@polkadot/react-hooks';

interface Props {
  address: string;
  name: string;
  onUpdateName: () => void;
}

function EditableSidebarSection ({ address, name, onUpdateName }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { flags, isEditingName, isEditingTags, onSaveName, onSaveTags, setName, setTags, tags, toggleIsEditingName, toggleIsEditingTags } = useAccountInfo(address);

  const isEditing = useCallback(() => isEditingName || isEditingTags, [isEditingName, isEditingTags]);

  const toggleIsEditing = () => {
    flags.isEditable && toggleIsEditingName();
    toggleIsEditingTags();
  };

  const onClick = () => {
    if (isEditing()) {
      updateNameAndTags();
    }

    toggleIsEditing();
  };

  const updateNameAndTags = () => {
    updateName();
    updateTags();
  };

  const updateName = () => {
    if (flags.isEditable && (flags.isInContacts || flags.isOwned)) {
      _onUpdateName();
      toggleIsEditingName();
    }
  };

  const updateTags = () => {
    onSaveTags();
  };

  const _onUpdateName = useCallback(
    (): void => {
      onSaveName();
      onUpdateName && onUpdateName();
    },
    [onSaveName, onUpdateName]
  );

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
      <EditAccountButton
        isEditing={isEditing}
        onClick={onClick}
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
