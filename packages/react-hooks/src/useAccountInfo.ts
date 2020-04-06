// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { StringOrNull } from '@polkadot/react-components/types';
import { Address, AccountId } from '@polkadot/types/interfaces';
import { AddressFlags, AddressIdentity, UseAccountInfo, UseAccountInfo$Loading } from './types';

import { useCallback, useEffect, useState } from 'react';
import keyring from '@polkadot/ui-keyring';
import useAccounts from './useAccounts';
import useAddresses from './useAddresses';
import useApi from './useApi';
import useCall from './useCall';
import useToggle from './useToggle';

const IS_NONE = {
  isCouncil: false,
  isDevelopment: false,
  isEditable: false,
  isExternal: false,
  isInAddressBook: false,
  isFavorite: false,
  isOwned: false,
  isSociety: false,
  isSudo: false,
  isTechCommittee: false
};

export default function useAccountInfo (_value?: AccountId | Address | string | null | Uint8Array): UseAccountInfo | UseAccountInfo$Loading | null {
  if (!_value) {
    return null;
  }

  const value = _value.toString();
  const api = useApi();
  const info = useCall<DeriveAccountInfo>(api.api.derive.accounts.info as any, [value]);
  const { isAccount } = useAccounts();
  const { isAddress } = useAddresses();

  const [tags, _setTags] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [genesisHash, setGenesisHash] = useState<StringOrNull>(null);
  const [identity, setIdentity] = useState<AddressIdentity | undefined>();

  const [flags, setFlags] = useState<AddressFlags>(IS_NONE);
  const [isEditingName, toggleIsEditingName] = useToggle(false);
  const [isEditingTags, toggleIsEditingTags] = useToggle(false);

  const setTags = useCallback(
    (tags: string[]): void => _setTags(tags.sort()),
    []
  );

  useEffect((): void => {
    const { flags: infoFlags, identity, nickname } = info || {};

    if (api.api.query.identity && api.api.query.identity.identityOf) {
      if (identity?.display) {
        setName(identity.display);
      }
    } else if (nickname) {
      setName(nickname);
    } else {
      setName('');
    }

    setFlags({
      ...flags,
      ...infoFlags
    });

    if (identity) {
      const judgements = identity.judgements.filter(([, judgement]): boolean => !judgement.isFeePaid);

      setIdentity({
        ...identity,
        isExistent: identity.judgements.length > 0,
        isGood: judgements.some(([, judgement]): boolean => judgement.isKnownGood || judgement.isReasonable),
        isBad: judgements.some(([, judgement]): boolean => judgement.isErroneous || judgement.isLowQuality),
        waitCount: identity.judgements.length - judgements.length,
        judgements
      });
    } else {
      setIdentity(undefined);
    }
  }, [info]);

  useEffect((): void => {
    const accountOrAddress = keyring.getAccount(value) || keyring.getAddress(value);
    const isOwned = isAccount(value);
    const isInAddressBook = isAddress(value);

    setGenesisHash(accountOrAddress?.meta.genesisHash || null);
    setFlags({
      ...flags,
      isInAddressBook,
      isOwned,
      isEditable: isInAddressBook || (accountOrAddress && !(accountOrAddress.meta.isInjected || accountOrAddress.meta.isHardware)) || false,
      isDevelopment: accountOrAddress?.meta.isTesting || false,
      isExternal: accountOrAddress?.meta.isExternal || false
    });
    setTags(accountOrAddress?.meta.tags ? accountOrAddress.meta.tags.sort() : []);
    setName(accountOrAddress?.meta.name || '');
  }, [isAccount, isAddress, value]);

  const onSaveName = (): void => {
    if (isEditingName) {
      toggleIsEditingName();
    }

    const meta = { name, whenEdited: Date.now() };

    if (value) {
      try {
        const currentKeyring = keyring.getPair(value);

        currentKeyring && keyring.saveAccountMeta(currentKeyring, meta);
      } catch (error) {
        keyring.saveAddress(value, meta);
      }
    }
  };

  const onSaveTags = (): void => {
    if (isEditingTags) {
      toggleIsEditingTags();
    }

    const meta = { tags, whenEdited: Date.now() };

    if (value) {
      try {
        const currentKeyring = keyring.getPair(value);

        currentKeyring && keyring.saveAccountMeta(currentKeyring, meta);
      } catch (error) {
        keyring.saveAddress(value, meta);
      }
    }
  };

  const onForgetAddress = (): void => {
    if (isEditingName) {
      toggleIsEditingName();
    }

    if (isEditingTags) {
      toggleIsEditingTags();
    }

    try {
      keyring.forgetAddress(value);
    } catch (e) {
      console.error(e);
    }
  };

  if (!info) {
    return {
      isReady: false
    };
  }

  const onSaveGenesisHash = (): void => {
    const account = keyring.getPair(value);

    account && keyring.saveAccountMeta(account, { ...account.meta, genesisHash });

    setGenesisHash(genesisHash);
  };

  return {
    isReady: true,
    name,
    setName,
    tags,
    setTags,
    genesisHash,
    setGenesisHash,
    identity,
    isEditingName,
    toggleIsEditingName,
    isEditingTags,
    toggleIsEditingTags,
    onSaveName,
    onSaveTags,
    onSaveGenesisHash,
    onForgetAddress,
    ...flags
  };
}
