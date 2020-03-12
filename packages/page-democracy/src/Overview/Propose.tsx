// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useCallback, useState } from 'react';
import { Input, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { Available } from '@polkadot/react-query';
import { isHex } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClose: () => void;
}

function Propose ({ className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [balance, setBalance] = useState<BN | undefined>();
  const [{ isHashValid, hash }, setHash] = useState<{ isHashValid: boolean; hash?: string }>({ isHashValid: false, hash: '' });

  const _onChangeHash = useCallback(
    (hash?: string): void => setHash({ isHashValid: isHex(hash, 256), hash }),
    []
  );

  return (
    <Modal
      className={className}
      header={t('Submit proposal')}
    >
      <Modal.Content>
        <InputAddress
          help={t('The account you want to register the proposal from')}
          label={t('send from account')}
          labelExtra={<Available label={<span className='label'>{t('transferrable')}</span>} params={accountId} />}
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
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          isDisabled={!balance || balance.lten(0) || !isHashValid || !accountId}
          isPrimary
          label={t('Submit proposal')}
          icon='add'
          onStart={onClose}
          params={[hash, balance]}
          tx='democracy.propose'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Propose);
