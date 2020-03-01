// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeypairType } from '@polkadot/util-crypto/types';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, Icon, Input, Modal, StatusContext } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';
import { assert, u8aToHex } from '@polkadot/util';
import { keyExtractSuri, mnemonicValidate } from '@polkadot/util-crypto';

import { useTranslation } from '../../translate';

interface Props {
  isOpen?: boolean;
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

export default function InjectKeys ({ isOpen = true, onClose }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { queueRpc } = useContext(StatusContext);
  // this needs to align with what is set as the first value in `type`
  const [crypto, setCrypto] = useState<KeypairType>('sr25519');
  const [publicKey, setPublicKey] = useState(EMPTY_KEY);
  const [suri, setSuri] = useState('');
  const [keyType, setKeyType] = useState('babe');
  const keyTypeOpt = useMemo(() => [
    { text: t('Aura'), value: 'aura' },
    { text: t('Babe'), value: 'babe' },
    { text: t('Grandpa'), value: 'gran' },
    { text: t('I\'m Online'), value: 'imon' },
    { text: t('Parachains'), value: 'para' }
  ], [t]);

  useEffect((): void => {
    setCrypto(CRYPTO_MAP[keyType][0]);
  }, [keyType]);

  useEffect((): void => {
    try {
      const { phrase } = keyExtractSuri(suri);

      assert(mnemonicValidate(phrase), 'Invalid mnemonic phrase');

      setPublicKey(u8aToHex(keyring.createFromUri(suri, {}, crypto).publicKey));
    } catch (error) {
      setPublicKey(EMPTY_KEY);
    }
  }, [crypto, suri]);

  if (!isOpen) {
    return null;
  }

  const _onSubmit = (): void =>
    queueRpc({
      rpc: { section: 'author', method: 'insertKey' } as any,
      values: [keyType, suri, publicKey]
    });
  const _cryptoOptions = CRYPTO_MAP[keyType].map((value): { text: string; value: KeypairType } => ({
    text: value === 'ed25519'
      ? t('ed25519, Edwards')
      : t('sr15519, Schnorrkel'),
    value
  }));

  return (
    <Modal
      header={t('Inject Keys')}
      size='small'
    >
      <Modal.Content>
        <Input
          isError={publicKey.length !== 66}
          label={t('suri (seed & derivation)')}
          onChange={setSuri}
          value={suri}
        />
        <Dropdown
          label={t('key type to set')}
          onChange={setKeyType}
          options={keyTypeOpt}
          value={keyType}
        />
        <Dropdown
          isDisabled={_cryptoOptions.length === 1}
          label={t('crypto type to use')}
          onChange={setCrypto}
          options={_cryptoOptions}
          value={crypto}
        />
        <Input
          isDisabled
          label={t('generated public key')}
          value={publicKey}
        />
        <article className='warning'>
          <div><Icon name='warning sign' />{t('This operation will submit the seed via an RPC call. Do not perform this operation on a public RPC node, but ensure that the node is local, connected to your validator and secure.')}</div>
        </article>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='sign-in'
          isPrimary
          label={t('Submit key')}
          onClick={_onSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
}
