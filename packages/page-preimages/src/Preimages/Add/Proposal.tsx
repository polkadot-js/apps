// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';
import type { HashState } from './types';

import React, { useCallback, useState } from 'react';

import { Extrinsic, Modal, Static } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  onChange: (state: HashState) => void;
}

const EMPTY_HASH = blake2AsHex('');

export const EMPTY_PROPOSAL: HashState = {
  encodedHash: EMPTY_HASH,
  encodedLength: 0,
  encodedProposal: null,
  extrinsic: null,
  storageFee: BN_ZERO
};

function getState (api: ApiPromise, proposal?: SubmittableExtrinsic<'promise'>): HashState {
  let encodedHash = EMPTY_HASH;
  let encodedProposal: HexString | null = null;
  let encodedLength = 0;
  let extrinsic: SubmittableExtrinsic<'promise'> | null = null;
  let storageFee = BN_ZERO;

  if (proposal) {
    encodedProposal = proposal.method.toHex();
    encodedLength = Math.ceil((encodedProposal.length - 2) / 2);
    encodedHash = blake2AsHex(encodedProposal);
    extrinsic = api.tx.preimage.notePreimage(encodedProposal);

    // we currently don't have a constant exposed, however match to Substrate
    storageFee = ((api.consts.preimage?.baseDeposit || BN_ZERO) as unknown as BN).add(
      ((api.consts.preimage?.byteDeposit || BN_ZERO) as unknown as BN).muln(encodedLength)
    );
  }

  return {
    encodedHash,
    encodedLength,
    encodedProposal,
    extrinsic,
    storageFee
  };
}

function Proposal ({ className, onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, apiDefaultTxSudo } = useApi();
  const [{ encodedHash, encodedLength }, setState] = useState<HashState>(EMPTY_PROPOSAL);

  const changeState = useCallback(
    (state: HashState): void => {
      setState(state);
      onChange(state);
    },
    [onChange]
  );

  const setProposal = useCallback(
    (proposal?: SubmittableExtrinsic<'promise'>) =>
      changeState(getState(api, proposal)),
    [api, changeState]
  );

  return (
    <Modal.Columns
      className={className}
      hint={
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
      <Static
        help={t<string>('The hash of the selected proposal, use it for submitting the proposal')}
        label={t<string>('preimage hash')}
        value={encodedHash}
        withCopy
      />
      <Static
        help={t<string>('The encoded length of the selected proposal, as available on-chain')}
        label={t<string>('preimage length')}
        value={encodedLength}
        withCopy
      />
    </Modal.Columns>
  );
}

export default React.memo(Proposal);
