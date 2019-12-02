// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { I18nProps } from '@polkadot/react-components/types';

import React, { useEffect, useState } from 'react';
import { Button, Input, InputAddress, Extrinsic, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { blake2AsHex } from '@polkadot/util-crypto';

import translate from '../translate';

interface Props extends I18nProps {
  onClose: () => void;
}

const ZERO_HASH = blake2AsHex('');

function PreImage ({ className, onClose, t }: Props): React.ReactElement<Props> {
  const { apiDefaultTxSudo } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [{ hex, hash }, setHash] = useState<{ hex: string; hash: string }>({ hex: '', hash: ZERO_HASH });
  const [proposal, setProposal] = useState<any>();

  useEffect((): void => {
    const hex = (proposal as SubmittableExtrinsic)?.method.toHex() || '';

    setHash({ hex, hash: blake2AsHex(hex) });
  }, [proposal]);

  return (
    <Modal
      className={className}
      dimmer='inverted'
      open
    >
      <Modal.Header>{t('Submit preimage')}</Modal.Header>
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
            tx='democracy.notePreimage'
            withSpinner={false}
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(PreImage);
