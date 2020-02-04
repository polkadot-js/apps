// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { Hash } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input, InputAddress, Extrinsic, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { blake2AsHex } from '@polkadot/util-crypto';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isImminent?: boolean;
  matchHash?: Hash;
  onClose: () => void;
}

const ZERO_HASH = blake2AsHex('');

function PreImage ({ className, isImminent: propsIsImminent, matchHash, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { apiDefaultTxSudo } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isImminent, setIsImminent] = useState(propsIsImminent || false);
  const [{ encodedProposal, encodedHash }, setHash] = useState<{ encodedProposal: string; encodedHash: string }>({ encodedProposal: '', encodedHash: ZERO_HASH });
  const [proposal, setProposal] = useState<any>();

  useEffect((): void => {
    const encodedProposal = (proposal as SubmittableExtrinsic)?.method.toHex() || '';

    setHash({ encodedProposal, encodedHash: blake2AsHex(encodedProposal) });
  }, [proposal]);

  const isMatched = matchHash
    ? matchHash.eq(encodedHash)
    : true;

  return (
    <Modal
      className={className}
      header={t('Submit preimage')}
    >
      <Modal.Content>
        <InputAddress
          help={t('The account you want to register the preimage from')}
          label={t('send from account')}
          labelExtra={<Available label={<span className='label'>{t('transferrable')}</span>} params={accountId} />}
          onChange={setAccountId}
          type='account'
        />
        <Extrinsic
          defaultValue={apiDefaultTxSudo}
          label={t('propose')}
          onChange={setProposal}
        />
        <Input
          help={t('The hash of the selected proposal, use it for submitting the proposal')}
          isDisabled
          isDisabledError={!isMatched}
          label={t('preimage hash')}
          value={encodedHash}
        />
        <Toggle
          className='toggleImminent'
          label={t('imminent preimage (proposal already passed)')}
          onChange={setIsImminent}
          value={isImminent}
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          isDisabled={!proposal || !accountId || !isMatched || !encodedProposal}
          isPrimary
          label={t('Submit preimage')}
          icon='add'
          onStart={onClose}
          params={[encodedProposal]}
          tx={isImminent ? 'democracy.noteImminentPreimage' : 'democracy.notePreimage'}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default styled(PreImage)`
  .toggleImminent {
    margin: 0.5rem 0;
    text-align: right;
  }
`;
