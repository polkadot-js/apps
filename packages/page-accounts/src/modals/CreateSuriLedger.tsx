// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import bip39 from 'bip39';
import React, { useEffect, useRef, useState } from 'react';

import networks from '@polkadot/networks';
import { Dropdown, MarkWarning, Modal } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import { AVAIL_INDEXES } from './Ledger';

interface Props {
  className?: string;
  mnemonic: string;
}

type ChainKeys = keyof typeof CHAIN_PATH;

// as per ZondaX with high bit (0x8) removed
const CHAIN_PATH = {
  dock: 0x00000252,
  kusama: 0x000001b2,
  polkadot: 0x00000162,
  polymesh: 0x00000253
};

const ledgerNets = networks.filter(({ hasLedgerSupport, network }) => hasLedgerSupport && CHAIN_PATH[network as ChainKeys]);

function CreateSuriLedger ({ className, mnemonic }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [accIndex, setAccIndex] = useState(0);
  const [addIndex, setAddIndex] = useState(0);
  const [chainType, setChainType] = useState<ChainKeys>('polkadot');
  const [seed, setSeed] = useState<Buffer | null>(null);

  useEffect((): void => {
    setSeed(
      mnemonic
        ? bip39.mnemonicToSeedSync(mnemonic)
        : null
    );
  }, [mnemonic]);

  useEffect((): void => {
    if (seed) {
      const path = `m/44'/${CHAIN_PATH[chainType]}'/${accIndex}'/0'/${addIndex}`;

      // derive either via bip32 or ed25519-hd-key here

      console.log('Deriving from', path);
    }
  }, [accIndex, addIndex, chainType, seed]);

  const netOpts = useRef(ledgerNets.map(({ displayName, network }) => ({
    text: displayName,
    value: network
  })));

  const accOps = useRef(AVAIL_INDEXES.map((value) => ({
    text: t('Account type {{index}}', { replace: { index: value } }),
    value
  })));

  const addOps = useRef(AVAIL_INDEXES.map((value) => ({
    text: t('Address index {{index}}', { replace: { index: value } }),
    value
  })));

  return (
    <Modal.Columns className={className}>
      <Modal.Columns>
        <Dropdown
          help={t('The network to derive on')}
          label={t('network type for account')}
          onChange={setChainType}
          options={netOpts.current}
          value={chainType}
        />
        <Dropdown
          help={t('The account type (derivation) to use')}
          label={t('account type')}
          onChange={setAccIndex}
          options={accOps.current}
          value={accIndex}
        />
        <Dropdown
          help={t('The address index (derivation on account) to use')}
          label={t('address index')}
          onChange={setAddIndex}
          options={addOps.current}
          value={addIndex}
        />
        <MarkWarning content={t<string>('ensure that you do keep your key secure on the Ledger at all times. If this is only done for temporary recovery, running in incognito mode would be advised so it is not stored in your main session.')} />
      </Modal.Columns>
      <Modal.Column>
        <p>{t<string>('The derivation will be constructed from the values you specify.')}</p>
      </Modal.Column>
    </Modal.Columns>
  );
}

export default React.memo(CreateSuriLedger);
