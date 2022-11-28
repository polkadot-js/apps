// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Nominations, ValidatorPrefs } from '@polkadot/types/interfaces';
import type { KeyringJson$Meta } from '@polkadot/ui-keyring/types';
import type { AddressFlags, AddressIdentity, UseAccountInfo } from './types';

import { useCallback, useEffect, useState } from 'react';

import { keyring } from '@polkadot/ui-keyring';
import { isFunction, isHex } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useAccounts } from './useAccounts';
import { useAddresses } from './useAddresses';
import { useApi } from './useApi';
import { useCall } from './useCall';
import { useDeriveAccountFlags } from './useDeriveAccountFlags';
import { useDeriveAccountInfo } from './useDeriveAccountInfo';
import { useToggle } from './useToggle';

const IS_NONE = {
  isCouncil: false,
  isDevelopment: false,
  isEditable: false,
  isEthereum: false,
  isExternal: false,
  isFavorite: false,
  isHardware: false,
  isInContacts: false,
  isInjected: false,
  isMultisig: false,
  isNominator: false,
  isOwned: false,
  isProxied: false,
  isSociety: false,
  isSudo: false,
  isTechCommittee: false,
  isValidator: false
};

function useAccountInfoImpl (value: string | null, isContract = false): UseAccountInfo {
  const { api } = useApi();
  const { isAccount } = useAccounts();
  const { isAddress } = useAddresses();
  const accountInfo = useDeriveAccountInfo(value);
  const accountFlags = useDeriveAccountFlags(value);
  const nominator = useCall<Nominations>(api.query.staking?.nominators, [value]);
  const validator = useCall<ValidatorPrefs>(api.query.staking?.validators, [value]);
  const [accountIndex, setAccountIndex] = useState<string | undefined>(undefined);
  const [tags, setSortedTags] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [genesisHash, setGenesisHash] = useState<string | null>(null);
  const [identity, setIdentity] = useState<AddressIdentity | undefined>();
  const [flags, setFlags] = useState<AddressFlags>(IS_NONE);
  const [meta, setMeta] = useState<KeyringJson$Meta | undefined>();
  const [isEditingName, toggleIsEditingName, setIsEditingName] = useToggle();
  const [isEditingTags, toggleIsEditingTags, setIsEditingTags] = useToggle();

  useEffect((): void => {
    validator && setFlags((flags) => ({
      ...flags,
      isValidator: !validator.isEmpty
    }));
  }, [validator]);

  useEffect((): void => {
    nominator && setFlags((flags) => ({
      ...flags,
      isNominator: !nominator.isEmpty
    }));
  }, [nominator]);

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

    if (isFunction(api.query.identity?.identityOf)) {
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

      setIdentity({
        ...identity,
        isExistent: !!identity.display,
        isKnownGood,
        judgements,
        waitCount: identity.judgements.length - judgements.length
      });
    } else {
      setIdentity(undefined);
    }
  }, [accountInfo, api]);

  useEffect((): void => {
    if (value) {
      try {
        const accountOrAddress = keyring.getAccount(value) || keyring.getAddress(value);
        const isOwned = isAccount(value);
        const isInContacts = isAddress(value);

        setGenesisHash(accountOrAddress?.meta.genesisHash || null);
        setFlags((flags): AddressFlags => ({
          ...flags,
          isDevelopment: accountOrAddress?.meta.isTesting || false,
          isEditable: !!(!identity?.display && (isInContacts || accountOrAddress?.meta.isMultisig || (accountOrAddress && !(accountOrAddress.meta.isInjected)))) || false,
          isEthereum: isHex(value, 160),
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
      } catch (error) {
        // ignore
      }
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
    (tags: string[]) => setSortedTags(tags.sort()),
    []
  );

  const isEditing = useCallback(() => isEditingName || isEditingTags, [isEditingName, isEditingTags]);

  return {
    accountIndex,
    flags,
    genesisHash,
    identity,
    isEditing,
    isEditingName,
    isEditingTags,
    isNull: !value,
    meta,
    name,
    onForgetAddress,
    onSaveName,
    onSaveTags,
    onSetGenesisHash,
    setIsEditingName,
    setIsEditingTags,
    setName,
    setTags,
    tags,
    toggleIsEditingName,
    toggleIsEditingTags
  };
}

export const useAccountInfo = createNamedHook('useAccountInfo', useAccountInfoImpl);
