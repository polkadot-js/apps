// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Input, InputAddress, Extrinsic, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { blake2AsHex } from '@polkadot/util-crypto';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClose: () => void;
}

const ZERO_HASH = blake2AsHex('');

function PreImage ({ className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { apiDefaultTxSudo } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isImminent, setIsImminent] = useState(false);
  const [{ hex, hash }, setHash] = useState<{ hex: string; hash: string }>({ hex: '', hash: ZERO_HASH });
  const [proposal, setProposal] = useState<any>();

  useEffect((): void => {
    const hex = (proposal as SubmittableExtrinsic)?.method.toHex() || '';

    setHash({ hex, hash: blake2AsHex(hex) });
  }, [proposal]);

  return (
    <Modal
      className={className}
      header={t('Submit preimage')}
      open
    >
      <Modal.Content>
        <InputAddress
          help={t('The account you want to register the preimage from')}
          label={t('send from account')}
          labelExtra={<Available label={t('transferrable')} params={accountId} />}
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
          label={t('preimage hash')}
          value={hash}
        />
        <Toggle
          className='toggleImminent'
          label={t('imminent preimage (proposal already passed)')}
          onChange={setIsImminent}
          value={isImminent}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            label={t('Cancel')}
            icon='add'
            onClick={onClose}
          />
          <Button.Or />
          <TxButton
            accountId={accountId}
            isDisabled={!proposal || !accountId}
            isPrimary
            label={t('Submit preimage')}
            icon='add'
            onStart={onClose}
            params={[hex]}
            tx={isImminent ? 'democracy.noteImminentPreimage' : 'democracy.notePreimage'}
            withSpinner={false}
          />
        </Button.Group>
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
