// Copyright 2017-2025 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import type { Hash } from '@polkadot/types/interfaces';
import type { HexString } from '@polkadot/util/types';

import React, { useEffect, useMemo, useState } from 'react';

import { InputAddress, InputBalance, Modal, Static, styled, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { Extrinsic } from '@polkadot/react-params';
import { Available } from '@polkadot/react-query';
import { BN, BN_ZERO, isString } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  isImminent?: boolean;
  imageHash?: Hash | HexString;
  onClose: () => void;
}

interface HashState {
  encodedHash: string;
  encodedProposal: string;
  storageFee: BN | null;
}

const ZERO_HASH = blake2AsHex('');

function PreImage ({ className = '', imageHash, isImminent = false, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, apiDefaultTxSudo } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [{ encodedHash, encodedProposal, storageFee }, setHash] = useState<HashState>({ encodedHash: ZERO_HASH, encodedProposal: '', storageFee: null });
  const [proposal, setProposal] = useState<SubmittableExtrinsic>();

  useEffect((): void => {
    const encodedProposal = proposal?.method.toHex() || '';
    const storageFee = api.consts.democracy.preimageByteDeposit
      ? (api.consts.democracy.preimageByteDeposit as unknown as BN).mul(
        encodedProposal
          ? new BN((encodedProposal.length - 2) / 2)
          : BN_ZERO
      )
      : null;

    setHash({ encodedHash: blake2AsHex(encodedProposal), encodedProposal, storageFee });
  }, [api, proposal]);

  const isMatched = useMemo(
    () => imageHash
      ? isString(imageHash)
        ? imageHash === encodedHash
        : imageHash.eq(encodedHash)
      : true,
    [encodedHash, imageHash]
  );

  return (
    <StyledModal
      className={className}
      header={t('Submit preimage')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('This account will pay the fees for the preimage, based on the size thereof.')}>
          <InputAddress
            label={t('send from account')}
            labelExtra={
              <Available
                label={<span className='label'>{t('transferable')}</span>}
                params={accountId}
              />
            }
            onChange={setAccountId}
            type='account'
          />
        </Modal.Columns>
        <Modal.Columns hint={
          <>
            <p>{t('The image (proposal) will be stored on-chain against the hash of the contents.')}</p>
            <p>{t('When submitting a proposal the hash needs to be known. Proposals can be submitted with hash-only, but upon dispatch the preimage needs to be available.')}</p>
          </>
        }
        >
          <Extrinsic
            defaultValue={apiDefaultTxSudo}
            label={t('propose')}
            onChange={setProposal}
          />
          <Static
            label={t('preimage hash')}
            value={encodedHash}
            withCopy
          />
        </Modal.Columns>
        {!isImminent && storageFee && (
          <Modal.Columns hint={t('The calculated storage costs based on the size and the per-bytes fee.')}>
            <InputBalance
              defaultValue={storageFee}
              isDisabled
              label={t('calculated storage fee')}
            />
          </Modal.Columns>
        )}
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={accountId}
          icon='plus'
          isDisabled={!proposal || !accountId || !isMatched || !encodedProposal}
          label={t('Submit preimage')}
          onStart={onClose}
          params={[encodedProposal]}
          tx={
            isImminent
              ? api.tx.democracy.noteImminentPreimage
              : api.tx.democracy.notePreimage
          }
        />
      </Modal.Actions>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .toggleImminent {
    margin: 0.5rem 0;
    text-align: right;
  }
`;

export default React.memo(PreImage);
