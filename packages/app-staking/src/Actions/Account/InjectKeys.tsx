// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { KeypairType } from '@polkadot/util-crypto/types';

import React, { useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Icon, Input, Modal, StatusContext } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';
import { assert, u8aToHex } from '@polkadot/util';
import { keyExtractSuri, mnemonicValidate } from '@polkadot/util-crypto';

import translate from '../../translate';

interface Props extends I18nProps {
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

function InjectKeys ({ isOpen = true, onClose, t }: Props): React.ReactElement<Props> | null {
  const { queueRpc } = useContext(StatusContext);
  // this needs to align with what is set as the first value in `type`
  const [crypto, setCrypto] = useState<KeypairType>('sr25519');
  const [publicKey, setPublicKey] = useState(EMPTY_KEY);
  const [suri, setSuri] = useState('');
  const [type, setType] = useState('babe');

  useEffect((): void => {
    setCrypto(CRYPTO_MAP[type][0]);
  }, [type]);

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

  const _onSubmit = (): void => {
    queueRpc({
      rpc: { section: 'author', method: 'insertKey' } as any,
      values: [type, suri, publicKey]
    });
  };
  const _cryptoOptions = CRYPTO_MAP[type].map((value): { text: string; value: KeypairType } => ({
    text: value === 'ed25519'
      ? t('ed25519, Edwards')
      : t('sr15519, Schnorrkel'),
    value
  }));

  return (
    <Modal
      dimmer='inverted'
      open
      size='small'
    >
      <Modal.Header>
        {t('Inject Keys')}
      </Modal.Header>
      <Modal.Content>
        <Input
          isError={publicKey.length !== 66}
          label={t('suri (seed & derivation)')}
          onChange={setSuri}
          value={suri}
        />
        <Dropdown
          label={t('key type to set')}
          onChange={setType}
          options={[
            { text: t('Aura'), value: 'aura' },
            { text: t('Babe'), value: 'babe' },
            { text: t('Grandpa'), value: 'gran' },
            { text: t('I\'m Online'), value: 'imon' },
            { text: t('Parachains'), value: 'para' }
          ]}
          value={type}
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
      <Modal.Actions>
        <Button.Group>
          <Button
            icon='cancel'
            isNegative
            label={t('Cancel')}
            onClick={onClose}
          />
          <Button.Or />
          <Button
            icon='sign-in'
            isPrimary
            label={t('Submit key')}
            onClick={_onSubmit}
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(InjectKeys);
