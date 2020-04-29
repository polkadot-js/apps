// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useCallback, useState } from 'react';
import { Input, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { isHex } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClose: () => void;
}

function Propose ({ className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [balance, setBalance] = useState<BN | undefined>();
  const [{ hash, isHashValid }, setHash] = useState<{ hash?: string; isHashValid: boolean }>({ hash: '', isHashValid: false });

  const _onChangeHash = useCallback(
    (hash?: string): void => setHash({ hash, isHashValid: isHex(hash, 256) }),
    []
  );

  const hasMinLocked = balance?.gte(api.consts.democracy.minimumDeposit);

  return (
    <Modal
      className={className}
      header={t('Submit proposal')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              help={t('The account you want to register the proposal from')}
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
            <p>{t('The proposal will be registered from this account and the balance lock will be applied here.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Input
              autoFocus
              help={t('The preimage hash of the proposal')}
              label={t('preimage hash')}
              onChange={_onChangeHash}
              value={hash}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('The hash of the preimage for the proposal as previously submitted or intended.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputBalance
              defaultValue={api.consts.democracy.minimumDeposit}
              help={t('The locked value for this proposal')}
              isError={!hasMinLocked}
              label={t('locked balance')}
              onChange={setBalance}
            />
            <InputBalance
              defaultValue={api.consts.democracy.minimumDeposit}
              help={t('The minimum deposit required')}
              isDisabled
              label={t('minimum deposit')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('The associated deposit for this proposal should be more then the minimum on-chain deposit required. It will be locked until the proposal passes.')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          icon='add'
          isDisabled={!balance || !hasMinLocked || !isHashValid || !accountId}
          isPrimary
          label={t('Submit proposal')}
          onStart={onClose}
          params={[hash, balance]}
          tx='democracy.propose'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Propose);
