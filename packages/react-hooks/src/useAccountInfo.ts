// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountFlags, DeriveAccountInfo } from '@polkadot/api-derive/types';
import { StringOrNull } from '@polkadot/react-components/types';
import { Address, AccountId } from '@polkadot/types/interfaces';
import { AddressFlags, AddressIdentity, UseAccountInfo } from './types';

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
  isFavorite: false,
  isInContacts: false,
  isOwned: false,
  isSociety: false,
  isSudo: false,
  isTechCommittee: false
};

export default function useAccountInfo (_value: AccountId | Address | string | Uint8Array): UseAccountInfo {
  const value = _value.toString();
  const api = useApi();
  const info = useCall<DeriveAccountInfo>(api.api.derive.accounts.info as any, [value]);
  const accountFlags = useCall<DeriveAccountFlags>(api.api.derive.accounts.flags as any, [value]) || {};
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
    const { identity, nickname } = info || {};

    if (api.api.query.identity && api.api.query.identity.identityOf) {
      if (identity?.display) {
        setName(identity.display);
      }
    } else if (nickname) {
      setName(nickname);
    } else {
      setName('');
    }

    setFlags((flags) => ({
      ...flags,
      ...accountFlags
    }));

    if (identity) {
      const judgements = identity.judgements.filter(([, judgement]): boolean => !judgement.isFeePaid);
      const isKnownGood = judgements.some(([, judgement]): boolean => judgement.isKnownGood);
      const isReasonable = judgements.some(([, judgement]): boolean => judgement.isReasonable);
      const isErroneous = judgements.some(([, judgement]): boolean => judgement.isErroneous);
      const isLowQuality = judgements.some(([, judgement]): boolean => judgement.isLowQuality);

      setIdentity({
        ...identity,
        isBad: isErroneous || isLowQuality,
        isErroneous,
        isExistent: identity.judgements.length > 0,
        isGood: isKnownGood || isReasonable,
        isKnownGood,
        isLowQuality,
        isReasonable,
        judgements,
        waitCount: identity.judgements.length - judgements.length
      });
    } else {
      setIdentity(undefined);
    }
  }, [api, accountFlags, info]);

  useEffect((): void => {
    const accountOrAddress = keyring.getAccount(value) || keyring.getAddress(value);
    const isOwned = isAccount(value);
    const isInContacts = isAddress(value);

    setGenesisHash(accountOrAddress?.meta.genesisHash || null);
    setFlags((flags) => ({
      ...flags,
      isDevelopment: accountOrAddress?.meta.isTesting || false,
      isEditable: (!identity?.display && (isInContacts || (accountOrAddress && !(accountOrAddress.meta.isInjected || accountOrAddress.meta.isHardware)))) || false,
      isExternal: accountOrAddress?.meta.isExternal || false,
      isInContacts,
      isOwned
    }));
    setTags(accountOrAddress?.meta.tags ? accountOrAddress.meta.tags.sort() : []);
    setName(accountOrAddress?.meta.name || '');
  }, [identity, isAccount, isAddress, setTags, value]);

  const onSaveName = useCallback(
    (): void => {
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
    },
    [isEditingName, name, toggleIsEditingName, value]
  );

  const onSaveTags = useCallback(
    (): void => {
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
    },
    [isEditingTags, tags, toggleIsEditingTags, value]
  );

  const onForgetAddress = useCallback(
    (): void => {
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
    },
    [isEditingName, isEditingTags, toggleIsEditingName, toggleIsEditingTags, value]
  );

  const onSaveGenesisHash = useCallback(
    (): void => {
      const account = keyring.getPair(value);

      account && keyring.saveAccountMeta(account, { ...account.meta, genesisHash });

      setGenesisHash(genesisHash);
    },
    [genesisHash, value]
  );

  return {
    genesisHash,
    identity,
    isEditingName,
    isEditingTags,
    name,
    onForgetAddress,
    onSaveGenesisHash,
    onSaveName,
    onSaveTags,
    setGenesisHash,
    setName,
    setTags,
    tags,
    toggleIsEditingName,
    toggleIsEditingTags,
    ...flags
  };
}
