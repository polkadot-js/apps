// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { DeriveStakingQuery } from '@polkadot/api-derive/types';

import React, { useEffect, useMemo, useState } from 'react';

import { InputAddressMulti, Modal, Spinner, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate.js';
import SenderInfo from '../partials/SenderInfo.js';

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
    () => queryInfo?.exposurePaged.isSome && queryInfo?.exposurePaged.unwrap().others.map(({ who }) => who.toString()),
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
      header={t('Remove nominees')}
      onClose={onClose}
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
              availableLabel={t('existing/active nominators')}
              defaultValue={nominating}
              maxCount={MAX_KICK}
              onChange={setSelected}
              valueLabel={t('nominators to be removed')}
            />
          )
          : <Spinner label={t('Retrieving active nominators')} />
        }
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={controllerId}
          extrinsic={kickTx}
          icon='user-slash'
          isDisabled={!kickTx}
          label={t('Remove')}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(KickNominees);
