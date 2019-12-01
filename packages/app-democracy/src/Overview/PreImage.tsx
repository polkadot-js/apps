// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Call } from '@polkadot/types/interfaces';
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
  const [hash, setHash] = useState(ZERO_HASH);
  const [proposal, setProposal] = useState<Call | undefined>();

  useEffect((): void => {
    setHash(
      proposal
        ? blake2AsHex(proposal.toU8a())
        : ZERO_HASH
    );
  }, [proposal]);

  const _createParams = (): any[] => [proposal?.toHex()];

  return (
    <Modal
      className={className}
      dimmer='inverted'
      open
    >
      <Modal.Header>{t('Submit preimage')}</Modal.Header>
      <Modal.Content>
        <InputAddress
          help={t('The account you wante to register the preimage from')}
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
          help={t('The hash of the selected call')}
          isDisabled
          label={t('call hash')}
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
          <TxButton
            accountId={accountId}
            isDisabled={!proposal || !accountId}
            isPrimary
            label={t('Submit preimage')}
            icon='add'
            onStart={onClose}
            params={_createParams}
            tx='democracy.notePreimage'
            withSpinner={false}
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(PreImage);
