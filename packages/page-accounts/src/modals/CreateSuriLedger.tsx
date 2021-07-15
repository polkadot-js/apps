// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';

import { selectableNetworks } from '@polkadot/networks';
import { Dropdown, MarkError, Modal } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import { AVAIL_INDEXES } from './Ledger';

interface Props {
  className?: string;
  onChange: (string: string) => void;
  seedType: string;
}

const ledgerNets = selectableNetworks.filter(({ hasLedgerSupport }) => hasLedgerSupport);

function CreateSuriLedger ({ className, onChange, seedType }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [accIndex, setAccIndex] = useState(0);
  const [addIndex, setAddIndex] = useState(0);
  const [chainType, setChainType] = useState('polkadot');

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

  useEffect((): void => {
    const network = ledgerNets.find(({ network }) => network === chainType);

    onChange(`m/44'/${network?.slip44 as number}'/${accIndex}'/0'/${addIndex}'`);
  }, [accIndex, addIndex, chainType, onChange]);

  return (
    <Modal.Columns
      className={className}
      hint={t<string>('The derivation will be constructed from the values you specify.')}
    >
      {seedType === 'bip'
        ? (
          <>
            <Dropdown
              help={t('The network to derive on')}
              label={t('Ledger app type (originated from)')}
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
          </>
        )
        : <MarkError content={t<string>('Derivation for Ledger-type accounts are only available on mnemonic seeds.')} />
      }
    </Modal.Columns>
  );
}

export default React.memo(CreateSuriLedger);
