// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { H256, Multisig } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useState } from 'react';
import { Dropdown, InputAddress, Modal, TxButton } from '@polkadot/react-components';

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

function MultisigApprove ({ className, onClose, ongoing, threshold, who }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [hash, setHash] = useState<string | null>(ongoing[0][0].toHex());
  const [multisig, setMultisig] = useState<[H256, Multisig] | null>(null);
  const [signatory, setSignatory] = useState<string | null>(null);
  const [type, setType] = useState<string | null>('aye');
  const calltypes = useMemo<Option[]>(
    () => [
      { text: t('Approve this call hash'), value: 'aye' },
      { text: t('Cancel this call hash'), value: 'nay' }
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

  return (
    <Modal
      className={className}
      header={t('Pending call hashes')}
    >
      <Modal.Content>
        <InputAddress
          filter={who}
          help={t('The signatory to send the approval/cancel from')}
          label={t('signatory')}
          onChange={setSignatory}
        />
        <Dropdown
          help={t('The call hashes that have not been executed as of yet.')}
          label={t('pending hashes')}
          onChange={setHash}
          options={hashes}
          value={hash}
        />
        <Dropdown
          help={t('Either approve or reject this call.')}
          label={t('approval type')}
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
          params={[threshold, who.filter((who) => who !== signatory), multisig ? multisig[1].when : null, hash]}
          tx={
            type === 'aye'
              ? 'utility.approveAsMulti'
              : 'utility.cancelAsMulti'
          }
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(MultisigApprove);
