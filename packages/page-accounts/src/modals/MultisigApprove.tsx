// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { AccountId, Call, H256, Multisig } from '@polkadot/types/interfaces';
import type { CallFunction } from '@polkadot/types/types';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { AddressMini, Dropdown, Expander, Input, InputAddress, MarkError, Modal, styled, Toggle, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useWeight } from '@polkadot/react-hooks';
import { Call as CallDisplay } from '@polkadot/react-params';
import { assert, isHex } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  address: string;
  className?: string;
  onClose: () => void;
  ongoing: [H256, Multisig][];
  threshold?: number;
  who?: string[];
}

interface MultiInfo {
  isMultiCall: boolean;
  multisig: Multisig | null;
}

interface Option {
  text: string;
  value: string;
}

interface CallData {
  callData: Call | null;
  callError: string | null;
  callInfo: CallFunction | null;
}

const EMPTY_CALL: CallData = {
  callData: null,
  callError: null,
  callInfo: null
};

function MultisigApprove ({ className = '', onClose, ongoing, threshold = 0, who = [] }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [callHex, setCallHex] = useState<string>('');
  const [{ callData, callError, callInfo }, setCallData] = useState<CallData>(EMPTY_CALL);
  const { encodedCallLength, weight } = useWeight(callData);
  const [hash, setHash] = useState<string | null>(() => ongoing[0][0].toHex());
  const [{ isMultiCall, multisig }, setMultisig] = useState<MultiInfo>(() => ({ isMultiCall: false, multisig: null }));
  const [isCallOverride, setCallOverride] = useState(true);
  const [others, setOthers] = useState<AccountId[]>([]);
  const [signatory, setSignatory] = useState<string | null>(null);
  const [whoFilter, setWhoFilter] = useState<string[]>([]);
  const [type, setType] = useState<string | null>('aye');
  const [tx, setTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);

  const callOptRef = useRef<Option[]>([
    { text: t('Approve this call hash'), value: 'aye' },
    { text: t('Cancel this call hash'), value: 'nay' }
  ]);

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
    setCallHex('');
    setCallData(EMPTY_CALL);
  }, [hash, ongoing, threshold]);

  // the others are all the who elements, without the current signatory (re-encoded)
  useEffect((): void => {
    setOthers(
      who
        .map((w) => api.createType('AccountId', w))
        .filter((w) => !signatory || !w.eq(signatory))
    );
  }, [api, signatory, who]);

  // Filter the who by those not approved yet that is an actual account we own. In the case of
  // rejections, we defer to the first approver, since he is the only one to send the cancel
  // On reaching threshold, we include all possible signatories in the list
  useEffect((): void => {
    const hasThreshold = multisig && (multisig.approvals.length >= threshold);

    setWhoFilter(
      who
        .map((w) => api.createType('AccountId', w).toString())
        .filter((w) => allAccounts.some((a) => a === w) && multisig && (
          type === 'nay'
            ? multisig.depositor.eq(w)
            : hasThreshold || !multisig.approvals.some((a) => a.eq(w))
        ))
    );
  }, [api, allAccounts, multisig, threshold, type, who]);

  // when the hex changes, re-evaluate
  useEffect((): void => {
    if (callHex) {
      try {
        assert(isHex(callHex), 'Hex call data required');

        const callData = api.createType('Call', callHex);

        assert(callData.hash.eq(hash), 'Call data does not match the existing call hash');

        const callInfo = api.registry.findMetaCall(callData.callIndex);

        setCallData({ callData, callError: null, callInfo });
      } catch (error) {
        setCallData({ callData: null, callError: (error as Error).message, callInfo: null });
      }
    } else {
      setCallData(EMPTY_CALL);
    }
  }, [api, callHex, hash]);

  // based on the type, multisig, others create the tx. This can be either an approval or final call
  useEffect((): void => {
    const multiMod = api.tx.multisig || api.tx.utility;

    setTx(() =>
      hash && multisig
        ? type === 'aye'
          ? isMultiCall && isCallOverride
            ? callData
              ? multiMod.asMulti.meta.args.length === 5
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                ? multiMod.asMulti(threshold, others, multisig.when, callData.toHex(), weight as any)
                : multiMod.asMulti.meta.args.length === 6
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore (We are doing toHex here since we have a Vec<u8> input)
                  ? multiMod.asMulti(threshold, others, multisig.when, callData.toHex(), false, weight)
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore (We are doing toHex here since we have a Vec<u8> input)
                  : multiMod.asMulti(threshold, others, multisig.when, callData)
              : null
            : multiMod.approveAsMulti.meta.args.length === 5
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              ? multiMod.approveAsMulti(threshold, others, multisig.when, hash, weight as any)
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              : multiMod.approveAsMulti(threshold, others, multisig.when, hash)
          : multiMod.cancelAsMulti(threshold, others, multisig.when, hash)
        : null
    );
  }, [api, callData, hash, isCallOverride, isMultiCall, others, multisig, threshold, type, weight]);

  const isAye = type === 'aye';

  return (
    <StyledModal
      className={className}
      header={t('Pending call hashes')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('The call hash from the list of available and unapproved calls.')}>
          <Dropdown
            label={t('pending hashes {{count}}', {
              replace: { count: `(${hashes.length})` }
            })}
            onChange={setHash}
            options={hashes}
            value={hash}
          />
        </Modal.Columns>
        {multisig && (
          <>
            <Modal.Columns hint={t('The creator for this multisig call')}>
              <InputAddress
                defaultValue={multisig.depositor}
                isDisabled
                label={t('depositor')}
              />
            </Modal.Columns>
            <Modal.Columns hint={t('The current approvals applied to this multisig')}>
              <Expander
                isPadded
                summary={t('Existing approvals ({{approvals}}/{{threshold}})', {
                  replace: {
                    approvals: multisig.approvals.length,
                    threshold
                  }
                })}
              >
                {multisig.approvals.map((a) =>
                  <AddressMini
                    isPadded={false}
                    key={assert.toString()}
                    value={a}
                  />
                )}
              </Expander>
            </Modal.Columns>
          </>
        )}
        <Modal.Columns hint={t('The operation type to apply. For approvals both non-final and final approvals are supported.')}>
          <Dropdown
            label={t('approval type')}
            onChange={setType}
            options={callOptRef.current}
            value={type}
          />
        </Modal.Columns>
        {whoFilter.length !== 0 && (
          <>
            <Modal.Columns hint={t('For approvals outstanding approvers will be shown, for hashes that should be cancelled the first approver is required.')}>
              <InputAddress
                filter={whoFilter}
                label={t('signatory')}
                onChange={setSignatory}
              />
            </Modal.Columns>
            {type === 'aye' && isMultiCall && (
              <>
                {isCallOverride && (
                  <Modal.Columns hint={t('The call data for this transaction matching the hash. Once sent, the multisig will be executed against this.')}>
                    <Input
                      autoFocus
                      isError={!callHex || !!callError}
                      label={t('call data for final approval')}
                      onChange={setCallHex}
                      value={callHex}
                    />
                    {callData && callInfo &&
                       (
                         <div style={{ marginTop: 8 }}>
                           <Expander
                             isPadded
                             summary={`${callInfo.section}.${callInfo.method}`}
                             summaryMeta={callInfo.meta}
                           >
                             <CallDisplay
                               className='details'
                               value={callData}
                             />
                           </Expander>
                         </div>
                       )
                    }
                    {callError && (
                      <MarkError content={callError} />
                    )}
                  </Modal.Columns>
                )}
                <Modal.Columns hint={t('Swap to a non-executing approval type, with subsequent calls providing the actual call data.')}>
                  <Toggle
                    className='tipToggle'
                    label={
                      isMultiCall
                        ? t('Multisig message with call (for final approval)')
                        : t('Multisig approval with hash (non-final approval)')
                    }
                    onChange={setCallOverride}
                    value={isCallOverride}
                  />
                </Modal.Columns>
              </>
            )}
          </>
        )}
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={signatory}
          extrinsic={tx}
          icon={isAye ? 'check' : 'times'}
          isDisabled={!tx || (isAye && (!whoFilter.length || (!!callData && !encodedCallLength)))}
          label={isAye ? 'Approve' : 'Reject'}
          onStart={onClose}
        />
      </Modal.Actions>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .tipToggle {
    width: fit-content;
    float: right;
    text-align: right;
  }
`;

export default React.memo(MultisigApprove);
