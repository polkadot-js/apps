// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeypairType } from '@polkadot/util-crypto/types';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button, Dropdown, Input, MarkWarning, Modal } from '@polkadot/react-components';
import { useQueue } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { assert, u8aToHex } from '@polkadot/util';
import { keyExtractSuri, mnemonicValidate } from '@polkadot/util-crypto';

import { useTranslation } from '../../translate.js';

interface Props {
  onClose: () => void;
}

const CRYPTO_MAP: Record<string, KeypairType[]> = {
  aura: ['ed25519', 'sr25519'],
  babe: ['sr25519'],
  gran: ['ed25519'],
  imon: ['ed25519', 'sr25519'],
  para: ['sr25519']
};

const EMPTY_KEY = '0x';

function InjectKeys ({ onClose }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { queueRpc } = useQueue();
  // this needs to align with what is set as the first value in `type`
  const [crypto, setCrypto] = useState<KeypairType>('sr25519');
  const [publicKey, setPublicKey] = useState(EMPTY_KEY);
  const [suri, setSuri] = useState('');
  const [keyType, setKeyType] = useState('babe');

  const keyTypeOptRef = useRef([
    { text: t('Aura'), value: 'aura' },
    { text: t('Babe'), value: 'babe' },
    { text: t('Grandpa'), value: 'gran' },
    { text: t('I\'m Online'), value: 'imon' },
    { text: t('Parachains'), value: 'para' }
  ]);

  useEffect((): void => {
    setCrypto(CRYPTO_MAP[keyType][0]);
  }, [keyType]);

  useEffect((): void => {
    try {
      const { phrase } = keyExtractSuri(suri);

      assert(mnemonicValidate(phrase), 'Invalid mnemonic phrase');

      setPublicKey(u8aToHex(keyring.createFromUri(suri, {}, crypto).publicKey));
    } catch {
      setPublicKey(EMPTY_KEY);
    }
  }, [crypto, suri]);

  const _onSubmit = useCallback(
    (): void => queueRpc({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      rpc: { method: 'insertKey', section: 'author' } as any,
      values: [keyType, suri, publicKey]
    }),
    [keyType, publicKey, queueRpc, suri]
  );

  const _cryptoOptions = useMemo(
    () => CRYPTO_MAP[keyType].map((value): { text: string; value: KeypairType } => ({
      text: value === 'ed25519'
        ? t('ed25519, Edwards')
        : t('sr15519, Schnorrkel'),
      value
    })),
    [keyType, t]
  );

  return (
    <Modal
      header={t('Inject Keys')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('The seed and derivation path will be submitted to the validator node. this is an advanced operation, only to be performed when you are sure of the security and connection risks.')}>
          <Input
            autoFocus
            isError={publicKey.length !== 66}
            label={t('suri (seed & derivation)')}
            onChange={setSuri}
            value={suri}
          />
          <MarkWarning content={t('This operation will submit the seed via an RPC call. Do not perform this operation on a public RPC node, but ensure that the node is local, connected to your validator and secure.')} />
        </Modal.Columns>
        <Modal.Columns hint={t('The key type and crypto type to use for this key. Be aware that different keys have different crypto requirements. You should be familiar with the type requirements for the different keys.')}>
          <Dropdown
            label={t('key type to set')}
            onChange={setKeyType}
            options={keyTypeOptRef.current}
            value={keyType}
          />
          <Dropdown
            isDisabled={_cryptoOptions.length === 1}
            label={t('crypto type to use')}
            onChange={setCrypto}
            options={_cryptoOptions}
            value={crypto}
          />
        </Modal.Columns>
        <Modal.Columns hint={t('This pubic key is what will be visible in your queued keys list. It is generated based on the seed and the crypto used.')}>
          <Input
            isDisabled
            label={t('generated public key')}
            value={publicKey}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='sign-in-alt'
          label={t('Submit key')}
          onClick={_onSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(InjectKeys);
