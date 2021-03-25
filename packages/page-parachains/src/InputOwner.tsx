// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OwnedId, OwnerInfo } from './types';

import React, { useEffect, useMemo, useState } from 'react';

import { Dropdown, InputAddress, Modal } from '@polkadot/react-components';

import { useTranslation } from './translate';

interface Props {
  onChange: (owner: OwnerInfo) => void;
  ownedIds: OwnedId[];
}

function InputOwner ({ onChange, ownedIds }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [paraId, setParaId] = useState<number>(0);

  useEffect((): void => {
    accountId && paraId && onChange({ accountId, paraId });
  }, [accountId, onChange, paraId]);

  const owners = useMemo(
    () => ownedIds.map(({ manager }) => manager),
    [ownedIds]
  );

  const optIds = useMemo(
    () => ownedIds
      .filter(({ manager }) => manager === accountId)
      .map(({ paraId }) => ({ text: paraId.toString(), value: paraId.toNumber() })),
    [accountId, ownedIds]
  );

  return (
    <Modal.Columns hint={
      <>
        <p>{t<string>('This account that has been used to register the parachain. This will pay all associated fees.')}</p>
        <p>{t<string>('The parachain id is associated with the selected account via parathread registration.')}</p>
      </>
    }>
      <InputAddress
        filter={owners}
        label={t<string>('parachain owner')}
        onChange={setAccountId}
        type='account'
        value={accountId}
      />
      {accountId && (
        <Dropdown
          defaultValue={optIds[0].value}
          key={accountId}
          label={t<string>('parachain id')}
          onChange={setParaId}
          options={optIds}
        />
      )}
    </Modal.Columns>
  );
}

export default React.memo(InputOwner);
