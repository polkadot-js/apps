// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect } from 'react';

import AccountMenuButtons from '@polkadot/app-accounts/Sidebar/AccountMenuButtons';
import Flags from '@polkadot/app-accounts/Sidebar/Flags';
import { useTranslation } from '@polkadot/app-accounts/translate';
import { AccountName, Input, Tags } from '@polkadot/react-components';
import { useAccountInfo, useOutsideClick } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';

interface Props {
  address: string;
  isBeingEdited: (arg: boolean) => void;
  onUpdateName: () => void;
  sidebarRef: React.RefObject<HTMLDivElement>;
}

function SidebarEditableSection ({ address, isBeingEdited, onUpdateName, sidebarRef }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { flags, isEditing, isEditingName, isEditingTags, name, onForgetAddress, onSaveName, onSaveTags, setIsEditingName, setIsEditingTags, setName, setTags, tags, toggleIsEditingName, toggleIsEditingTags } = useAccountInfo(address);

  useEffect(() => {
    isBeingEdited(isEditing());
  }, [isBeingEdited, isEditing]);

  const onCancel = useCallback(
    (): void => {
      if (isEditing()) {
        try {
          const accountOrAddress = keyring.getAccount(address) || keyring.getAddress(address);

          setName(accountOrAddress?.meta.name || '');
          setTags(accountOrAddress?.meta.tags ? (accountOrAddress.meta.tags as string[]).sort() : []);
          setIsEditingName(false);
          setIsEditingTags(false);
        } catch (error) {
          // ignore
        }
      }
    }, [isEditing, setName, setTags, setIsEditingName, setIsEditingTags, address]);

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
          withEditButton={false}
          withTitle
        />
      </div>
      <Flags flags={flags} />
      <AccountMenuButtons
        flags={flags}
        isEditing={isEditing()}
        isEditingName={isEditingName}
        onCancel={onCancel}
        onForgetAddress={onForgetAddress}
        onSaveName={onSaveName}
        onSaveTags={onSaveTags}
        onUpdateName={onUpdateName}
        recipientId={address}
        toggleIsEditingName={toggleIsEditingName}
        toggleIsEditingTags={toggleIsEditingTags}
      />
    </>
  );
}

export default React.memo(SidebarEditableSection);
