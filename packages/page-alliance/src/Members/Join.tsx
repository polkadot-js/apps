// Copyright 2017-2025 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Member, Unscrupulous } from '../types.js';

import React, { useMemo, useState } from 'react';

import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  members: Member[];
  onClose: () => void;
  unscrupulous: Unscrupulous;
}

function Join ({ className, members, onClose, unscrupulous: { accounts } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);

  const available = useMemo(
    (): string[] =>
      allAccounts.filter((a) =>
        !members.some(({ accountId }) =>
          accountId === a
        ) &&
        !accounts.some((accountId) =>
          accountId === a
        )
      ),
    [accounts, allAccounts, members]
  );

  return (
    <Modal
      className={className}
      header={t('Join alliance')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('This account will be submitted to join the aliance. It will be allocated one of the alliance roles upon joining, starting with Ally.')}>
          <InputAddress
            filter={available}
            label={t('alliance account')}
            onChange={setAccountId}
            type='account'
          />
        </Modal.Columns>
        <Modal.Columns hint={t('The bond will be reserved for the duration of your alliance membership.')}>
          <InputBalance
            defaultValue={api.consts.alliance.allyDeposit}
            isDisabled
            label={t('alliance deposit')}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={accountId}
          onStart={onClose}
          tx={api.tx.alliance.joinAlliance}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Join);
