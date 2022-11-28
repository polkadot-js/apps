// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';

import React, { useEffect, useState } from 'react';

import { Button, Extrinsic, Input, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN, BN_ZERO } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  imageHash?: string;
}

interface HashState {
  encodedHash: string;
  encodedProposal: string;
  storageFee: BN;
}

const ZERO_HASH = blake2AsHex('');

function Add ({ className, imageHash }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, apiDefaultTxSudo } = useApi();
  const [isAddOpen, toggleAdd] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [{ encodedHash, encodedProposal, storageFee }, setHash] = useState<HashState>({ encodedHash: ZERO_HASH, encodedProposal: '', storageFee: BN_ZERO });
  const [proposal, setProposal] = useState<SubmittableExtrinsic<'promise'>>();

  useEffect((): void => {
    const encodedProposal = (proposal as SubmittableExtrinsic<'promise'>)?.method.toHex() || '';

    // we currently don't have a constant exposed, or rather, maybe somewhere else...
    // const storageFee = api.consts.democracy.preimageByteDeposit.mul(
    //   encodedProposal
    //     ? new BN((encodedProposal.length - 2) / 2)
    //     : BN_ZERO
    // );

    setHash({ encodedHash: blake2AsHex(encodedProposal), encodedProposal, storageFee: BN_ZERO });
  }, [api, proposal]);

  const isMatched = imageHash
    ? imageHash === encodedHash
    : true;

  return (
    <>
      {isAddOpen && (
        <Modal
          className={className}
          header={t<string>('Submit preimage')}
          onClose={toggleAdd}
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
            {!storageFee.isZero() && (
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
              onStart={toggleAdd}
              params={[encodedProposal]}
              tx={api.tx.preimage.notePreimage}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='plus'
        label={t<string>('Add preimage')}
        onClick={toggleAdd}
      />
    </>
  );
}

export default React.memo(Add);
