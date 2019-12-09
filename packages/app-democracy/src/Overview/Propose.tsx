// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useState } from 'react';
import { Button, Input, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { Available } from '@polkadot/react-query';
import { isHex } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  onClose: () => void;
}

function Propose ({ className, onClose, t }: Props): React.ReactElement<Props> {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [balance, setBalance] = useState<BN | undefined>();
  const [{ isHashValid, hash }, setHash] = useState<{ isHashValid: boolean; hash?: string }>({ isHashValid: false, hash: '' });

  const _onChangeHash = (hash?: string): void => setHash({
    isHashValid: isHex(hash, 256),
    hash
  });

  return (
    <Modal
      className={className}
      header={t('Submit proposal')}
      open
    >
      <Modal.Content>
        <InputAddress
          help={t('The account you want to register the proposal from')}
          label={t('send from account')}
          labelExtra={<Available label={t('transferrable')} params={accountId} />}
          onChange={setAccountId}
          type='account'
        />
        <Input
          autoFocus
          help={t('The preimage hash of the proposal')}
          label={t('preimage hash')}
          onChange={_onChangeHash}
          value={hash}
        />
        <InputBalance
          help={t('The locked value for this proposal')}
          label={t('locked balance')}
          onChange={setBalance}
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
            isDisabled={!balance || balance.lten(0) || !isHashValid || !accountId}
            isPrimary
            label={t('Submit proposal')}
            icon='add'
            onStart={onClose}
            params={[hash, balance]}
            tx='democracy.propose'
            withSpinner={false}
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(Propose);
