// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Member, Unscrupulous } from '../types';

import React, { useMemo, useState } from 'react';

import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

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
      header={t<string>('Join alliance')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('This account will be submitted to join the aliance. It will be allocated one of the alliance roles upon joining, starting with Ally.')}>
          <InputAddress
            filter={available}
            help={t<string>('Select the account you wish to join with')}
            label={t<string>('alliance account')}
            onChange={setAccountId}
            type='account'
          />
        </Modal.Columns>
        <Modal.Columns hint={t('The bond will be reserved for the duration of your alliance membership.')}>
          <InputBalance
            defaultValue={api.consts.alliance.allyDeposit}
            help={t<string>('The deposit that is reserved')}
            isDisabled
            label={t<string>('alliance deposit')}
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
