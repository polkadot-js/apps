// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeypairType } from '@polkadot/util-crypto/types';

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, Icon, Input, Modal, StatusContext } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';
import { assert, u8aToHex } from '@polkadot/util';
import { keyExtractSuri, mnemonicValidate } from '@polkadot/util-crypto';

import { useTranslation } from '../../translate';

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
  const { queueRpc } = useContext(StatusContext);
  // this needs to align with what is set as the first value in `type`
  const [crypto, setCrypto] = useState<KeypairType>('sr25519');
  const [publicKey, setPublicKey] = useState(EMPTY_KEY);
  const [suri, setSuri] = useState('');
  const [keyType, setKeyType] = useState('babe');
  const keyTypeOpt = useMemo(() => [
    { text: t<string>('Aura'), value: 'aura' },
    { text: t<string>('Babe'), value: 'babe' },
    { text: t<string>('Grandpa'), value: 'gran' },
    { text: t<string>('I\'m Online'), value: 'imon' },
    { text: t<string>('Parachains'), value: 'para' }
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
        ? t<string>('ed25519, Edwards')
        : t<string>('sr15519, Schnorrkel'),
      value
    })),
    [keyType, t]
  );

  return (
    <Modal
      header={t<string>('Inject Keys')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <Input
              autoFocus
              isError={publicKey.length !== 66}
              label={t<string>('suri (seed & derivation)')}
              onChange={setSuri}
              value={suri}
            />
            <article className='warning'>
              <div><Icon icon='exclamation-triangle' />{t<string>('This operation will submit the seed via an RPC call. Do not perform this operation on a public RPC node, but ensure that the node is local, connected to your validator and secure.')}</div>
            </article>
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The seed and derivation path will be submitted to the validator node. this is an advanced operation, only to be performed when you are sure of the security and connection risks.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Dropdown
              label={t<string>('key type to set')}
              onChange={setKeyType}
              options={keyTypeOpt}
              value={keyType}
            />
            <Dropdown
              isDisabled={_cryptoOptions.length === 1}
              label={t<string>('crypto type to use')}
              onChange={setCrypto}
              options={_cryptoOptions}
              value={crypto}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The key type and crypto type to use for this key. Be aware that different keys have different crypto requirements. You should be familiar with the type requirements for the different keys.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Input
              isDisabled
              label={t<string>('generated public key')}
              value={publicKey}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('This pubic key is what will be visible in your queued keys list. It is generated based on the seed and the crypto used.')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='sign-in-alt'
          label={t<string>('Submit key')}
          onClick={_onSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(InjectKeys);
