// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Call, H256, Multisig } from '@polkadot/types/interfaces';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { registry } from '@polkadot/react-api';
import { Dropdown, InputAddress, Modal, Toggle, TxButton, Input } from '@polkadot/react-components';
import { useAccounts, useApi, useWeight } from '@polkadot/react-hooks';
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
  const [callWeight] = useWeight(callData);
  const [hash, setHash] = useState<string | null>(ongoing[0][0].toHex());
  const [{ isMultiCall, multisig }, setMultisig] = useState<MultiInfo>({ isMultiCall: false, multisig: null });
  const [isCallOverride, setCallOverride] = useState(true);
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

  // Filter the who by those not approved yet that is an actual account we own. In the case of
  // rejections, we defer to the the first approver, since he is the only one to send the cancel
  // On reaching threshold, we include all possible signatories in the list
  useEffect((): void => {
    const hasThreshold = multisig && (multisig.approvals.length >= threshold);

    setWhoFilter(
      who
        .map((w) => registry.createType('AccountId', w).toString())
        .filter((w) => allAccounts.some((a) => a === w) && multisig && (
          type === 'nay'
            ? multisig.approvals[0].eq(w)
            : hasThreshold || !multisig.approvals.some((a) => a.eq(w))
        ))
    );
  }, [allAccounts, multisig, threshold, type, who]);

  // based on the type, multisig, others create the tx. This can be either an approval or final call
  useEffect((): void => {
    const multiMod = api.tx.multisig || api.tx.utility;

    setTx(() =>
      hash && multisig
        ? type === 'aye'
          ? isMultiCall && isCallOverride
            ? callData
              ? multiMod.asMulti.meta.args.length === 6
                ? multiMod.asMulti(threshold, others, multisig.when, callData.toHex(), false, callWeight)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore (We are doing toHex here since we have a Vec<u8> input)
                : multiMod.asMulti(threshold, others, multisig.when, callData)
              : null
            : multiMod.approveAsMulti.meta.args.length === 5
              ? multiMod.approveAsMulti(threshold, others, multisig.when, hash, callWeight)
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              : multiMod.approveAsMulti(threshold, others, multisig.when, hash)
          : multiMod.cancelAsMulti(threshold, others, multisig.when, hash)
        : null
    );
  }, [api, callData, callWeight, hash, isCallOverride, isMultiCall, others, multisig, threshold, type]);

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
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <Dropdown
              help={t<string>('The call hashes that have not been executed as of yet.')}
              label={t<string>('pending hashes')}
              onChange={setHash}
              options={hashes}
              value={hash}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('The call hash from the list of available and unapproved calls.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Dropdown
              help={t<string>('Either approve or reject this call.')}
              label={t<string>('approval type')}
              onChange={setType}
              options={calltypes}
              value={type}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('The operation type to apply. For approvals both non-final and final approvals are supported.')}</p>
          </Modal.Column>
        </Modal.Columns>
        {whoFilter.length !== 0 && (
          <>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  filter={whoFilter}
                  help={t<string>('The signatory to send the approval/cancel from')}
                  label={t<string>('signatory')}
                  onChange={setSignatory}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t('For approvals outstanding approvers will be shown, for hashes that should be cancelled the first approver is required.')}</p>
              </Modal.Column>
            </Modal.Columns>
            {type === 'aye' && isMultiCall && (
              <>
                {isCallOverride && (
                  <Modal.Columns>
                    <Modal.Column>
                      <Input
                        autoFocus
                        help={t('For final approvals, the actual full call data is required to execute the transaction')}
                        isError={!callData}
                        label={t('call data for final approval')}
                        onChange={_setCallData}
                      />
                    </Modal.Column>
                    <Modal.Column>
                      <p>{t('The call data for this transaction matching the hash. Once sent, the multisig will be executed against this.')}</p>
                    </Modal.Column>
                  </Modal.Columns>
                )}
                <Modal.Columns>
                  <Modal.Column>
                    <Toggle
                      className='tipToggle'
                      label={
                        isMultiCall
                          ? t<string>('Multisig message with call (for final approval)')
                          : t<string>('Multisig approval with hash (non-final approval)')
                      }
                      onChange={setCallOverride}
                      value={isCallOverride}
                    />
                  </Modal.Column>
                  <Modal.Column>
                    <p>{t('Swap to a non-executing approval type, with subsequent calls providing the actual call data.')}</p>
                  </Modal.Column>
                </Modal.Columns>
              </>
            )}
          </>
        )}
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={signatory}
          extrinsic={tx}
          icon={type === 'aye' ? 'check' : 'times'}
          isDisabled={!tx || !whoFilter.length}
          label={type === 'aye' ? 'Approve' : 'Reject'}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(MultisigApprove)`
  .tipToggle {
    width: 100%;
    text-align: right;
  }
`);
