// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useMemo } from 'react';

import { useAccountInfo, useOutsideClick } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';

import Tags from '../Tags.js';
import AccountMenuButtons from './AccountMenuButtons.js';
import AddressSection from './AddressSection.js';
import Flags from './Flags.js';

interface Props {
  accountIndex: string | undefined;
  address: string;
  isBeingEdited: (arg: boolean) => void;
  onUpdateName?: (() => void) | null;
  sidebarRef: React.RefObject<HTMLDivElement>;
}

function SidebarEditableSection ({ accountIndex, address, isBeingEdited, onUpdateName, sidebarRef }: Props): React.ReactElement<Props> {
  const { flags, isEditing, isEditingName, isEditingTags, name, onForgetAddress, onSaveName, onSaveTags, setIsEditingName, setIsEditingTags, setName, setTags, tags, toggleIsEditingName, toggleIsEditingTags } = useAccountInfo(address);

  const refs = useMemo(
    () => [sidebarRef],
    [sidebarRef]
  );

  useEffect((): void => {
    isBeingEdited(isEditing());
  }, [isBeingEdited, isEditing]);

  const onCancel = useCallback(
    (): void => {
      if (isEditing()) {
        try {
          const accountOrAddress = keyring.getAccount(address) || keyring.getAddress(address);

          setName(accountOrAddress?.meta.name || '');
          setTags(accountOrAddress?.meta.tags ? (accountOrAddress.meta.tags).sort() : []);
          setIsEditingName(false);
          setIsEditingTags(false);
        } catch {
          // ignore
        }
      }
    }, [isEditing, setName, setTags, setIsEditingName, setIsEditingTags, address]);

  useOutsideClick(refs, onCancel);

  return (
    <>
      <AddressSection
        accountIndex={accountIndex}
        defaultValue={name}
        editingName={isEditingName}
        flags={flags}
        onChange={setName}
        value={address}
      />
      <div
        className='ui--AddressMenu-tags'
        data-testid='sidebar-tags'
      >
        <Tags
          isEditable
          isEditing={isEditingTags}
          onChange={setTags}
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
