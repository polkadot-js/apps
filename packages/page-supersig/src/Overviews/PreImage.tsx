// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import type { Hash } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Extrinsic, Input, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN, BN_ZERO } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isImminent?: boolean;
  imageHash?: Hash;
  onClose: () => void;
}

interface HashState {
  encodedHash: string;
  encodedProposal: string;
  storageFee: BN;
}

const ZERO_HASH = blake2AsHex('');

function PreImage ({ className = '', imageHash, isImminent = false, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, apiDefaultTxSudo } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [{ encodedHash, encodedProposal, storageFee }, setHash] = useState<HashState>({ encodedHash: ZERO_HASH, encodedProposal: '', storageFee: BN_ZERO });
  const [proposal, setProposal] = useState<SubmittableExtrinsic>();

  useEffect((): void => {
    const encodedProposal = (proposal as SubmittableExtrinsic)?.method.toHex() || '';
    const storageFee = api.consts.democracy.preimageByteDeposit.mul(
      encodedProposal
        ? new BN((encodedProposal.length - 2) / 2)
        : BN_ZERO
    );

    setHash({ encodedHash: blake2AsHex(encodedProposal), encodedProposal, storageFee });
  }, [api, proposal]);

  const isMatched = imageHash
    ? imageHash.eq(encodedHash)
    : true;

  return (
    <Modal
      className={className}
      header={t<string>('Submit preimage')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('This account will pay the fees for the preimage, based on the size thereof.')}>
          <InputAddress
            help={t<string>('The account you want to register the preimage from')}
            label={t<string>('send from account')}
            labelExtra={
              <Available
                label={<span className='label'>{t<string>('transferrable')}</span>}
                params={accountId}
              />
            }
            onChange={setAccountId}
            type='account'
          />
        </Modal.Columns>
        <Modal.Columns hint={
          <>
            <p>{t<string>('The image (proposal) will be stored on-chain against the hash of the contents.')}</p>
            <p>{t<string>('When submitting a proposal the hash needs to be known. Proposals can be submitted with hash-only, but upon dispatch the preimage needs to be available.')}</p>
          </>
        }
        >
          <Extrinsic
            defaultValue={apiDefaultTxSudo}
            label={t<string>('propose')}
            onChange={setProposal}
          />
          <Input
            className='disabledLook'
            help={t<string>('The hash of the selected proposal, use it for submitting the proposal')}
            isDisabledError={!isMatched}
            label={t<string>('preimage hash')}
            value={encodedHash}
          />
        </Modal.Columns>
        {!isImminent && (
          <Modal.Columns hint={t<string>('The calculated storage costs based on the size and the per-bytes fee.')}>
            <InputBalance
              defaultValue={storageFee}
              help={t<string>('The amount reserved to store this image')}
              isDisabled
              label={t<string>('calculated storage fee')}
            />
          </Modal.Columns>
        )}
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={accountId}
          icon='plus'
          isDisabled={!proposal || !accountId || !isMatched || !encodedProposal}
          label={t<string>('Submit preimage')}
          onStart={onClose}
          params={[encodedProposal]}
          tx={
            isImminent
              ? api.tx.democracy.noteImminentPreimage
              : api.tx.democracy.notePreimage
          }
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(PreImage)`
  .toggleImminent {
    margin: 0.5rem 0;
    text-align: right;
  }

  .disabledLook input {
    background: transparent;
    border-style: dashed;
    &:focus{
      background: transparent;
      border-color: #d9d8d7;
    }
  }
`);
