// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletStakingStakingLedger } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import React, { useState } from 'react';

import { InputBalance, Modal, Static, styled, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate.js';
import SenderInfo from '../partials/SenderInfo.js';
import useUnbondDuration from '../useUnbondDuration.js';

interface Props {
  controllerId?: string | null;
  onClose: () => void;
  stakingLedger?: PalletStakingStakingLedger;
  stashId: string;
}

function Unbond ({ controllerId, onClose, stakingLedger, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bondedBlocks = useUnbondDuration();
  const [maxBalance] = useState<BN | null>(() => stakingLedger?.active?.unwrap() || null);
  const [maxUnbond, setMaxUnbond] = useState<BN | undefined>();

  return (
    <StyledModal
      header={t('Unbond funds')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <SenderInfo
          controllerId={controllerId}
          stashId={stashId}
        />
        <Modal.Columns hint={t('The funds will only be available for withdrawal after the unbonding period, however will not be part of the staked amount after the next validator election. You can follow the unlock countdown in the UI.')}>
          <InputBalance
            autoFocus
            defaultValue={maxBalance}
            label={t('unbond amount')}
            labelExtra={
              <FormatBalance
                label={<span className='label'>{t('bonded')}</span>}
                value={maxBalance}
              />
            }
            maxValue={maxBalance}
            onChange={setMaxUnbond}
            withMax
          />
          {bondedBlocks?.gtn(0) && (
            <Static
              label={t('on-chain bonding duration')}
            >
              <BlockToTime value={bondedBlocks} />
            </Static>
          )}
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={controllerId}
          icon='unlock'
          isDisabled={!maxUnbond?.gt(BN_ZERO)}
          label={t('Unbond')}
          onStart={onClose}
          params={[maxUnbond]}
          tx={api.tx.staking.unbond}
        />
      </Modal.Actions>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .staking--Unbond--max > div {
    justify-content: flex-end;

    & .column {
      flex: 0;
    }
  }
`;

export default React.memo(Unbond);
