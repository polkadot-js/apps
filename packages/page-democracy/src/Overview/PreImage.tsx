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
  imageHash?: Hash;
  onClose: () => void;
}

const ZERO_HASH = blake2AsHex('');

function PreImage ({ className, imageHash, isImminent: propsIsImminent, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { apiDefaultTxSudo } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isImminent, setIsImminent] = useState(propsIsImminent || false);
  const [{ encodedHash, encodedProposal }, setHash] = useState<{ encodedHash: string; encodedProposal: string }>({ encodedHash: ZERO_HASH, encodedProposal: '' });
  const [proposal, setProposal] = useState<any>();

  useEffect((): void => {
    const encodedProposal = (proposal as SubmittableExtrinsic)?.method.toHex() || '';

    setHash({ encodedHash: blake2AsHex(encodedProposal), encodedProposal });
  }, [proposal]);

  const isMatched = imageHash
    ? imageHash.eq(encodedHash)
    : true;

  return (
    <Modal
      className={className}
      header={t('Submit preimage')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              help={t('The account you want to register the preimage from')}
              label={t('send from account')}
              labelExtra={
                <Available
                  label={<span className='label'>{t('transferrable')}</span>}
                  params={accountId}
                />
              }
              onChange={setAccountId}
              type='account'
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('This account will pay the fees for the preimage, based on the size thereof.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
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
          </Modal.Column>
          <Modal.Column>
            <p>{t('The image (proposal) will be stored on-chain against the hash of the contents.')}</p>
            <p>{t('When submitting a proposal the hash needs to be known. Proposals can be submitted with hash-only, but upon dispatch the preimage needs to be available.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Toggle
              className='toggleImminent'
              label={t('imminent preimage (proposal already passed)')}
              onChange={setIsImminent}
              value={isImminent}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('Only applicable if the proposal has already passed and is ready for dispatch.')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          icon='add'
          isDisabled={!proposal || !accountId || !isMatched || !encodedProposal}
          isPrimary
          label={t('Submit preimage')}
          onStart={onClose}
          params={[encodedProposal]}
          tx={isImminent ? 'democracy.noteImminentPreimage' : 'democracy.notePreimage'}
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
`);
