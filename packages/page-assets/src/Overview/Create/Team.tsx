// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TeamState } from './types.js';

import React, { useEffect, useState } from 'react';

import { InputAddress, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate.js';

interface Props {
  accountId: string;
  className?: string;
  defaultValue: TeamState | null;
  onChange: (info: TeamState | null) => void;
}

function Team ({ accountId, className = '', defaultValue, onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [initial] = useState(() => defaultValue);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [freezerId, setFreezerId] = useState<string | null>(null);
  const [issuerId, setIssuerId] = useState<string | null>(null);

  useEffect((): void => {
    onChange(
      adminId && freezerId && issuerId
        ? { adminId, freezerId, issuerId }
        : null
    );
  }, [api, adminId, freezerId, issuerId, onChange]);

  return (
    <Modal.Content className={className}>
      <Modal.Columns hint={t('The account that is to be used for ongoing admin on the token.')}>
        <InputAddress
          defaultValue={initial?.adminId || accountId}
          label={t('admin account')}
          onChange={setAdminId}
          type='account'
        />
      </Modal.Columns>
      <Modal.Columns hint={t('The account that is to be used for issuing this token.')}>
        <InputAddress
          defaultValue={initial?.issuerId || accountId}
          label={t('issuer account')}
          onChange={setIssuerId}
          type='account'
        />
      </Modal.Columns>
      <Modal.Columns hint={t('The account that is to be used for performing freezing.')}>
        <InputAddress
          defaultValue={initial?.freezerId || accountId}
          label={t('freezer account')}
          onChange={setFreezerId}
          type='account'
        />
      </Modal.Columns>
    </Modal.Content>
  );
}

export default React.memo(Team);
