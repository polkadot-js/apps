// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingAccount } from '@polkadot/api-derive/types';

import React, { useMemo, useState } from 'react';

import { InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN, BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate.js';
import SenderInfo from '../partials/SenderInfo.js';

interface Props {
  controllerId: string | null;
  onClose: () => void;
  stakingInfo?: DeriveStakingAccount;
  stashId: string;
}

// TODO we should check that the bonded amoutn, after the operation is >= ED
function Rebond ({ controllerId, onClose, stakingInfo, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [maxAdditional, setMaxAdditional] = useState<BN | undefined>();

  const startBalance = useMemo(
    () => stakingInfo?.unlocking
      ? stakingInfo.unlocking.reduce((total, { value }) => total.iadd(value), new BN(0))
      : BN_ZERO,
    [stakingInfo]
  );

  return (
    <Modal
      header= {t('Bond more funds')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <SenderInfo
          controllerId={controllerId}
          stashId={stashId}
        />
        {startBalance && (
          <Modal.Columns hint={t('The amount the is to be rebonded from the value currently unlocking, i.e. previously unbonded')}>
            <InputBalance
              autoFocus
              defaultValue={startBalance}
              isError={!maxAdditional || maxAdditional.eqn(0) || maxAdditional.gt(startBalance)}
              label={t('rebonded amount')}
              onChange={setMaxAdditional}
            />
          </Modal.Columns>
        )}
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={controllerId}
          icon='sign-in-alt'
          isDisabled={!maxAdditional || maxAdditional.isZero() || !startBalance || maxAdditional.gt(startBalance)}
          label={t('Rebond')}
          onStart={onClose}
          params={[maxAdditional]}
          tx={api.tx.staking.rebond}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Rebond);
