// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { InfoState } from './types';

import React, { useEffect, useMemo, useState } from 'react';

import { Input, InputAddress, InputNumber, Modal, Toggle } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  uniqueIds: BN[];
  className?: string;
  defaultValue: InfoState | null;
  onChange: (info: InfoState | null) => void;
  openId: BN;
}

function Info ({ uniqueIds, defaultValue, onChange, openId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [initial] = useState(() => defaultValue);
  const [initialId] = useState(() => openId);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [uniqueId, setUniqueId] = useState<BN | null>(null);
  const [data, setData] = useState<string>('');
  const [isFrozen, setIsFrozen] = useState<boolean>(false);

  const isValidId = useMemo(
    () => !!uniqueId && uniqueId.gt(BN_ZERO) && !uniqueIds.some((a) => a.eq(uniqueId)),
    [uniqueId, uniqueIds]
  );

  useEffect((): void => {
    onChange(
      uniqueId && isValidId  && accountId && !uniqueId.isZero()
        ? { accountId, uniqueId, data, isFrozen }
        : null
    );
  }, [api, accountId, uniqueId, uniqueIds, isValidId, onChange]);

  return (
    <Modal.Content className=''>
      <Modal.Columns hint={t<string>('The account that is to be used to create this unique class and setup the initial metadata.')}>
        <InputAddress
          defaultValue={initial?.accountId}
          label={t<string>('creator account')}
          onChange={setAccountId}
          type='account'
        />
      </Modal.Columns>
      <Modal.Columns hint={t<string>('The selected id for the unique class. This should not match an already-existing unique class id.')}>
        <InputNumber
          defaultValue={initial?.uniqueId || initialId}
          isError={!isValidId}
          isZeroable={false}
          label={t<string>('unique class id')}
          onChange={setUniqueId}
        />
      </Modal.Columns>
      <Modal.Columns hint={t<string>('The metadata associated with this unique class.')}>
        <Input
          label={t<string>('class data')}
          onChange={setData}
          value={data}
          placeholder='0x...'
        />
      </Modal.Columns>
      <Modal.Columns hint={t<string>('Can the unique be transferred?')}>
        <Toggle
          label={t<string>('frozen')}
          onChange={setIsFrozen}
          value={isFrozen}
        />
      </Modal.Columns>
    </Modal.Content>
  );
}

export default React.memo(Info);
