// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';

import React, { useCallback, useState } from 'react';

import { Input, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { isHex } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClose: () => void;
}

interface HashState {
  hash?: string;
  isHashValid: boolean;
}

function Propose ({ className = '', onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [balance, setBalance] = useState<BN | undefined>();
  const [{ hash, isHashValid }, setHash] = useState<HashState>({ hash: '', isHashValid: false });
  const publicProps = useCall<unknown[]>(api.query.democracy.publicProps);

  const _onChangeHash = useCallback(
    (hash?: string): void => setHash({ hash, isHashValid: isHex(hash, 256) }),
    []
  );

  const hasMinLocked = balance?.gte(api.consts.democracy.minimumDeposit);

  return (
    <Modal
      className={className}
      header={t<string>('Submit proposal')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('The proposal will be registered from this account and the balance lock will be applied here.')}>
          <InputAddress
            help={t<string>('The account you want to register the proposal from')}
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
        <Modal.Columns hint={t<string>('The hash of the preimage for the proposal as previously submitted or intended.')}>
          <Input
            autoFocus
            help={t<string>('The preimage hash of the proposal')}
            label={t<string>('preimage hash')}
            onChange={_onChangeHash}
            value={hash}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The associated deposit for this proposal should be more then the minimum on-chain deposit required. It will be locked until the proposal passes.')}>
          <InputBalance
            defaultValue={api.consts.democracy.minimumDeposit}
            help={t<string>('The locked value for this proposal')}
            isError={!hasMinLocked}
            label={t<string>('locked balance')}
            onChange={setBalance}
          />
          <InputBalance
            defaultValue={api.consts.democracy.minimumDeposit}
            help={t<string>('The minimum deposit required')}
            isDisabled
            label={t<string>('minimum deposit')}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          icon='plus'
          isDisabled={!balance || !hasMinLocked || !isHashValid || !accountId || !publicProps}
          label={t<string>('Submit proposal')}
          onStart={onClose}
          params={
            api.tx.democracy.propose.meta.args.length === 3
              ? [hash, balance, publicProps?.length]
              : [hash, balance]
          }
          tx={api.tx.democracy.propose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Propose);
