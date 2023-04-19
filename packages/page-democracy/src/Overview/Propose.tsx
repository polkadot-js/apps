// Copyright 2017-2023 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';

import React, { useCallback, useState } from 'react';

import { Input, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall, usePreimage } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { isFunction, isHex } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  onClose: () => void;
}

interface HashState {
  hash?: HexString;
  isHashValid: boolean;
}

function Propose ({ className = '', onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [balance, setBalance] = useState<BN | undefined>();
  const [{ hash, isHashValid }, setHash] = useState<HashState>({ isHashValid: false });
  const publicProps = useCall<unknown[]>(api.query.democracy.publicProps);
  const preimage = usePreimage(hash);

  const _onChangeHash = useCallback(
    (hash?: string): void =>
      setHash({ hash: hash as HexString, isHashValid: isHex(hash, 256) }),
    []
  );

  const hasMinLocked = balance?.gte(api.consts.democracy.minimumDeposit);

  return (
    <Modal
      className={className}
      header={t<string>('Submit proposal')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('The proposal will be registered from this account and the balance lock will be applied here.')}>
          <InputAddress
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
            isError={!isHashValid}
            label={t<string>('preimage hash')}
            onChange={_onChangeHash}
            value={hash}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The associated deposit for this proposal should be more then the minimum on-chain deposit required. It will be locked until the proposal passes.')}>
          <InputBalance
            defaultValue={api.consts.democracy.minimumDeposit}
            isError={!hasMinLocked}
            label={t<string>('locked balance')}
            onChange={setBalance}
          />
          <InputBalance
            defaultValue={api.consts.democracy.minimumDeposit}
            isDisabled
            label={t<string>('minimum deposit')}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={accountId}
          icon='plus'
          isDisabled={!balance || !hasMinLocked || !isHashValid || !accountId || !publicProps || (isFunction(api.tx.preimage?.notePreimage) && !isFunction(api.tx.democracy?.notePreimage) && !preimage)}
          label={t<string>('Submit proposal')}
          onStart={onClose}
          params={
            api.tx.democracy.propose.meta.args.length === 3
              ? [hash, balance, publicProps?.length]
              : isFunction(api.tx.preimage?.notePreimage) && !isFunction(api.tx.democracy?.notePreimage)
                ? [preimage && { Lookup: { hash: preimage.proposalHash, len: preimage.proposalLength } }, balance]
                : [hash, balance]
          }
          tx={api.tx.democracy.propose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Propose);
