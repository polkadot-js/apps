// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { DeriveStakingQuery } from '@polkadot/api-derive/types';

import React, { useEffect, useMemo, useState } from 'react';

import { InputAddressMulti, Modal, Spinner, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import SenderInfo from '../partials/SenderInfo';

interface Props {
  className?: string;
  controllerId: string;
  nominating?: string[];
  onClose: () => void;
  stashId: string;
}

const MAX_KICK = 128;

const accountOpts = {
  withExposure: true
};

function KickNominees ({ className = '', controllerId, nominating, onClose, stashId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [selected, setSelected] = useState<string[]>([]);
  const [{ kickTx }, setTx] = useState<{ kickTx?: null | SubmittableExtrinsic<'promise'> }>({});
  const queryInfo = useCall<DeriveStakingQuery>(api.derive.staking.query, [stashId, accountOpts]);

  const nominators = useMemo(
    () => queryInfo?.exposure?.others.map(({ who }) => who.toString()),
    [queryInfo]
  );

  useEffect((): void => {
    try {
      setTx({
        kickTx: selected.length
          ? api.tx.staking.kick(selected)
          : null
      });
    } catch {
      setTx({ kickTx: null });
    }
  }, [api, selected]);

  return (
    <Modal
      className={className}
      header={t<string>('Remove nominees')}
      size='large'
    >
      <Modal.Content>
        <SenderInfo
          controllerId={controllerId}
          stashId={stashId}
        />
        {nominators
          ? (
            <InputAddressMulti
              available={nominators}
              availableLabel={t<string>('existing/active nominators')}
              defaultValue={nominating}
              help={t<string>('Filter available nominators based on name, address or short account index.')}
              maxCount={MAX_KICK}
              onChange={setSelected}
              valueLabel={t<string>('nominators to be removed')}
            />
          )
          : <Spinner label={t<string>('Retrieving active nominators')} />
        }
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={controllerId}
          extrinsic={kickTx}
          icon='user-slash'
          isDisabled={!kickTx}
          label={t<string>('Remove')}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(KickNominees);
