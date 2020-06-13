// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, H256, Multisig } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { Dropdown, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';

interface Props {
  address: string;
  className?: string;
  onClose: () => void;
  ongoing: [H256, Multisig][];
  threshold: number;
  who: string[];
}

interface Option {
  text: string;
  value: string;
}

function MultisigApprove ({ className = '', onClose, ongoing, threshold, who }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [hash, setHash] = useState<string | null>(ongoing[0][0].toHex());
  const [multisig, setMultisig] = useState<[H256, Multisig] | null>(null);
  const [others, setOthers] = useState<AccountId[]>([]);
  const [signatory, setSignatory] = useState<string | null>(null);
  const [whoFilter, setWhoFilter] = useState<string[]>([]);
  const [type, setType] = useState<string | null>('aye');
  const calltypes = useMemo<Option[]>(
    () => [
      { text: t<string>('Approve this call hash'), value: 'aye' },
      { text: t<string>('Cancel this call hash'), value: 'nay' }
    ],
    [t]
  );
  const hashes = useMemo<Option[]>(
    () => ongoing.map(([h]) => ({ text: h.toHex(), value: h.toHex() })),
    [ongoing]
  );

  useEffect((): void => {
    hash && setMultisig(
      ongoing.find(([h]) => h.eq(hash)) || null
    );
  }, [hash, ongoing]);

  useEffect((): void => {
    setOthers(
      who
        .map((w) => registry.createType('AccountId', w))
        .filter((w) => !w.eq(signatory))
    );
  }, [signatory, who]);

  useEffect((): void => {
    setWhoFilter(
      who.map((w) => registry.createType('AccountId', w).toString())
    );
  }, [who]);

  return (
    <Modal
      className={className}
      header={t<string>('Pending call hashes')}
    >
      <Modal.Content>
        <InputAddress
          filter={whoFilter}
          help={t<string>('The signatory to send the approval/cancel from')}
          label={t<string>('signatory')}
          onChange={setSignatory}
        />
        <Dropdown
          help={t<string>('The call hashes that have not been executed as of yet.')}
          label={t<string>('pending hashes')}
          onChange={setHash}
          options={hashes}
          value={hash}
        />
        <Dropdown
          help={t<string>('Either approve or reject this call.')}
          label={t<string>('approval type')}
          onChange={setType}
          options={calltypes}
          value={type}
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={signatory}
          icon={type === 'aye' ? 'check' : 'cancel'}
          isDisabled={!multisig}
          label={type === 'aye' ? 'Approve' : 'Reject'}
          onStart={onClose}
          params={[threshold, others, multisig ? multisig[1].when : null, hash]}
          tx={`${api.tx.multisig ? 'multisig' : 'utility'}.${type === 'aye' ? 'approveAsMulti' : 'cancelAsMulti'}`}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(MultisigApprove);
