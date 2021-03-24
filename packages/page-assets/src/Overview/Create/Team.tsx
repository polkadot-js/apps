// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { TeamState } from './types';

import React, { useEffect, useState } from 'react';

import { InputAddress, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';

interface Props {
  accountId?: string;
  assetId?: BN;
  className?: string;
  defaultValue: TeamState | null;
  onChange: (info: TeamState | null) => void;
}

function Team ({ accountId, assetId, className = '', defaultValue, onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [initial] = useState(() => defaultValue);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [freezerId, setFreezerId] = useState<string | null>(null);
  const [issuerId, setIssuerId] = useState<string | null>(null);

  useEffect((): void => {
    onChange(
      assetId && accountId && adminId && freezerId && issuerId
        ? adminId !== accountId || freezerId !== accountId || issuerId !== accountId
          ? { adminId, freezerId, issuerId, teamTx: api.tx.assets.setTeam(assetId, issuerId, adminId, freezerId) }
          : { adminId, freezerId, issuerId, teamTx: null }
        : null
    );
  }, [api, assetId, accountId, adminId, freezerId, issuerId, onChange]);

  return (
    <Modal.Content className={className}>
      <Modal.Columns hint={t<string>('The account that is to be used for ongoing admin on the token.')}>
        <InputAddress
          defaultValue={initial?.adminId || accountId}
          label={t<string>('admin account')}
          onChange={setAdminId}
          type='account'
        />
      </Modal.Columns>
      <Modal.Columns hint={t<string>('The account that is to be used for issuing for this token.')}>
        <InputAddress
          defaultValue={initial?.issuerId || accountId}
          label={t<string>('issuer account')}
          onChange={setIssuerId}
          type='account'
        />
      </Modal.Columns>
      <Modal.Columns hint={t<string>('The account that is to be used for performing freezing.')}>
        <InputAddress
          defaultValue={initial?.freezerId || accountId}
          label={t<string>('freezer account')}
          onChange={setFreezerId}
          type='account'
        />
      </Modal.Columns>
    </Modal.Content>
  );
}

export default React.memo(Team);
