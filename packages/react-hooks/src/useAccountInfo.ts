// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountFlags, DeriveAccountInfo } from '@polkadot/api-derive/types';
import { StringOrNull } from '@polkadot/react-components/types';
import { KeyringJson$Meta } from '@polkadot/ui-keyring/types';
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
  isHardware: false,
  isInContacts: false,
  isInjected: false,
  isMultisig: false,
  isOwned: false,
  isProxied: false,
  isSociety: false,
  isSudo: false,
  isTechCommittee: false
};

export default function useAccountInfo (value: string | null, isContract = false): UseAccountInfo {
  const { api } = useApi();
  const { isAccount } = useAccounts();
  const { isAddress } = useAddresses();
  const accountInfo = useCall<DeriveAccountInfo>(api.derive.accounts.info as any, [value]);
  const accountFlags = useCall<DeriveAccountFlags>(api.derive.accounts.flags as any, [value]);
  const [accountIndex, setAccountIndex] = useState<string | undefined>(undefined);
  const [tags, setSortedTags] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [genesisHash, setGenesisHash] = useState<StringOrNull>(null);
  const [identity, setIdentity] = useState<AddressIdentity | undefined>();
  const [flags, setFlags] = useState<AddressFlags>(IS_NONE);
  const [meta, setMeta] = useState<KeyringJson$Meta | undefined>();
  const [isEditingName, toggleIsEditingName] = useToggle();
  const [isEditingTags, toggleIsEditingTags] = useToggle();

  useEffect((): void => {
    accountFlags && setFlags((flags) => ({
      ...flags,
      ...accountFlags
    }));
  }, [accountFlags]);

  useEffect((): void => {
    const { accountIndex, identity, nickname } = accountInfo || {};
    const newIndex = accountIndex?.toString();

    setAccountIndex((oldIndex) =>
      oldIndex !== newIndex
        ? newIndex
        : oldIndex
    );

    let name;

    if (api.query.identity && api.query.identity.identityOf) {
      if (identity?.display) {
        name = identity.display;
      }
    } else if (nickname) {
      name = nickname;
    }

    setName(name || '');

    if (identity) {
      const judgements = identity.judgements.filter(([, judgement]) => !judgement.isFeePaid);
      const isKnownGood = judgements.some(([, judgement]) => judgement.isKnownGood);
      const isReasonable = judgements.some(([, judgement]) => judgement.isReasonable);
      const isErroneous = judgements.some(([, judgement]) => judgement.isErroneous);
      const isLowQuality = judgements.some(([, judgement]) => judgement.isLowQuality);

      setIdentity({
        ...identity,
        isBad: isErroneous || isLowQuality,
        isErroneous,
        isExistent: !!identity.display,
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
  }, [accountInfo, api]);

  useEffect((): void => {
    if (value) {
      const accountOrAddress = keyring.getAccount(value) || keyring.getAddress(value);
      const isOwned = isAccount(value);
      const isInContacts = isAddress(value);

      setGenesisHash(accountOrAddress?.meta.genesisHash || null);
      setFlags((flags): AddressFlags => ({
        ...flags,
        isDevelopment: accountOrAddress?.meta.isTesting || false,
        isEditable: !!(!identity?.display && (isInContacts || accountOrAddress?.meta.isMultisig || (accountOrAddress && !(accountOrAddress.meta.isInjected || accountOrAddress.meta.isHardware)))) || false,
        isExternal: !!accountOrAddress?.meta.isExternal || false,
        isHardware: !!accountOrAddress?.meta.isHardware || false,
        isInContacts,
        isInjected: !!accountOrAddress?.meta.isInjected || false,
        isMultisig: !!accountOrAddress?.meta.isMultisig || false,
        isOwned,
        isProxied: !!accountOrAddress?.meta.isProxied || false
      }));
      setMeta(accountOrAddress?.meta);
      setName(accountOrAddress?.meta.name || '');
      setSortedTags(accountOrAddress?.meta.tags ? (accountOrAddress.meta.tags as string[]).sort() : []);
    }
  }, [identity, isAccount, isAddress, value]);

  const onSaveName = useCallback(
    (): void => {
      if (isEditingName) {
        toggleIsEditingName();
      }

      const meta = { name, whenEdited: Date.now() };

      if (isContract) {
        try {
          if (value) {
            const originalMeta = keyring.getAddress(value)?.meta;

            keyring.saveContract(value, { ...originalMeta, ...meta });
          }
        } catch (error) {
          console.error(error);
        }
      } else if (value) {
        try {
          const pair = keyring.getPair(value);

          pair && keyring.saveAccountMeta(pair, meta);
        } catch (error) {
          const pair = keyring.getAddress(value);

          if (pair) {
            keyring.saveAddress(value, meta);
          } else {
            keyring.saveAddress(value, { genesisHash: api.genesisHash.toHex(), ...meta });
          }
        }
      }
    },
    [api, isContract, isEditingName, name, toggleIsEditingName, value]
  );

  const onSaveTags = useCallback(
    (): void => {
      const meta = { tags, whenEdited: Date.now() };

      if (isContract) {
        try {
          if (value) {
            const originalMeta = keyring.getAddress(value)?.meta;

            value && keyring.saveContract(value, { ...originalMeta, ...meta });
          }
        } catch (error) {
          console.error(error);
        }
      } else if (value) {
        try {
          const currentKeyring = keyring.getPair(value);

          currentKeyring && keyring.saveAccountMeta(currentKeyring, meta);
        } catch (error) {
          keyring.saveAddress(value, meta);
        }
      }
    },
    [isContract, tags, value]
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
        value && keyring.forgetAddress(value);
      } catch (e) {
        console.error(e);
      }
    },
    [isEditingName, isEditingTags, toggleIsEditingName, toggleIsEditingTags, value]
  );

  const onSetGenesisHash = useCallback(
    (genesisHash: string | null): void => {
      if (value) {
        const account = keyring.getPair(value);

        account && keyring.saveAccountMeta(account, { ...account.meta, genesisHash });

        setGenesisHash(genesisHash);
      }
    },
    [value]
  );

  const setTags = useCallback(
    (tags: string[]): void => setSortedTags(tags.sort()),
    []
  );

  return {
    accountIndex,
    flags,
    genesisHash,
    identity,
    isEditingName,
    isEditingTags,
    isNull: !value,
    meta,
    name,
    onForgetAddress,
    onSaveName,
    onSaveTags,
    onSetGenesisHash,
    setName,
    setTags,
    tags,
    toggleIsEditingName,
    toggleIsEditingTags
  };
}
