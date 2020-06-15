// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Call, H256, Multisig } from '@polkadot/types/interfaces';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { Dropdown, InputAddress, Modal, TxButton, Input } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';
import { assert, isHex } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  address: string;
  className?: string;
  onClose: () => void;
  ongoing: [H256, Multisig][];
  threshold: number;
  who: string[];
}

interface MultiInfo {
  isMultiCall: boolean;
  multisig: Multisig | null;
}

interface Option {
  text: string;
  value: string;
}

function MultisigApprove ({ className = '', onClose, ongoing, threshold, who }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [callData, setCallData] = useState<Call | null>(null);
  const [hash, setHash] = useState<string | null>(ongoing[0][0].toHex());
  const [{ isMultiCall, multisig }, setMultisig] = useState<MultiInfo>({ isMultiCall: false, multisig: null });
  const [others, setOthers] = useState<AccountId[]>([]);
  const [signatory, setSignatory] = useState<string | null>(null);
  const [whoFilter, setWhoFilter] = useState<string[]>([]);
  const [type, setType] = useState<string | null>('aye');
  const [tx, setTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
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

  // filter the current multisig by supplied hash
  useEffect((): void => {
    const [, multisig] = ongoing.find(([h]) => h.eq(hash)) || [null, null];

    setMultisig({
      isMultiCall: !!multisig && (multisig.approvals.length + 1) >= threshold,
      multisig
    });
    setCallData(null);
  }, [hash, ongoing, threshold]);

  // the others are all the who elements, without the current signatory (re-encoded)
  useEffect((): void => {
    setOthers(
      who
        .map((w) => registry.createType('AccountId', w))
        .filter((w) => !w.eq(signatory))
    );
  }, [signatory, who]);

  // filter the who by those not approved yet that is an actual account we own
  useEffect((): void => {
    setWhoFilter(
      who
        .map((w) => registry.createType('AccountId', w).toString())
        .filter((w) => multisig && !multisig.approvals.some((a) => a.eq(w)) && allAccounts.some((a) => a === w))
    );
  }, [allAccounts, multisig, who]);

  // based on the type, multisig, others create the tx. This can be either an approval or final call
  useEffect((): void => {
    const multiMod = api.tx.multisig || api.tx.utility;

    setTx(() =>
      hash && multisig
        ? type === 'aye'
          ? isMultiCall
            ? callData
              ? multiMod.asMulti.meta.args.length === 5
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ? multiMod.asMulti(threshold, others, multisig.when, callData, false)
                : multiMod.asMulti(threshold, others, multisig.when, callData)
              : null
            : multiMod.approveAsMulti(threshold, others, multisig.when, hash)
          : multiMod.cancelAsMulti(threshold, others, multisig.when, hash)
        : null
    );
  }, [api, callData, hash, isMultiCall, others, multisig, threshold, type]);

  // when the actual call input changes, create a call and set it
  const _setCallData = useCallback(
    (callHex: string): void => {
      try {
        assert(isHex(callHex), 'Hex call data required');

        const callData = registry.createType('Call', callHex);

        setCallData(
          callData.hash.eq(hash)
            ? callData
            : null
        );
      } catch (error) {
        setCallData(null);
      }
    },
    [hash]
  );

  return (
    <Modal
      className={className}
      header={t<string>('Pending call hashes')}
    >
      <Modal.Content>
        <Dropdown
          help={t<string>('The call hashes that have not been executed as of yet.')}
          label={t<string>('pending hashes')}
          onChange={setHash}
          options={hashes}
          value={hash}
        />
        {whoFilter.length !== 0 && (
          <>
            <InputAddress
              filter={whoFilter}
              help={t<string>('The signatory to send the approval/cancel from')}
              label={t<string>('signatory')}
              onChange={setSignatory}
            />
            <Dropdown
              help={t<string>('Either approve or reject this call.')}
              label={t<string>('approval type')}
              onChange={setType}
              options={calltypes}
              value={type}
            />
            {type === 'aye' && isMultiCall && (
              <Input
                autoFocus
                help={t('For final approvals, the actual full call data is required to execute the transaction')}
                isError={!callData}
                label={t('call data for final approval')}
                onChange={_setCallData}
              />
            )}
          </>
        )}
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={signatory}
          extrinsic={tx}
          icon={type === 'aye' ? 'check' : 'cancel'}
          isDisabled={!tx || !whoFilter.length}
          label={type === 'aye' ? 'Approve' : 'Reject'}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(MultisigApprove);
