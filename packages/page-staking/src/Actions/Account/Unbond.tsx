// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, StakingLedger } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useState } from 'react';
import styled from 'styled-components';

import { InputAddress, InputBalance, Modal, Static, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';
import useUnbondDuration from '../useUnbondDuration';

interface Props {
  controllerId?: AccountId | string | null;
  onClose: () => void;
  stakingLedger?: StakingLedger;
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
      header={t<string>('Unbond funds')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('The stash and controller pair, here the controller will be used to send the transaction.')}>
          <InputAddress
            defaultValue={stashId}
            isDisabled
            label={t<string>('stash account')}
          />
          <InputAddress
            defaultValue={controllerId}
            isDisabled
            label={t<string>('controller account')}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The funds will only be available for withdrawal after the unbonding period, however will not be part of the staked amount after the next validator election. You can follow the unlock countdown in the UI.')}>
          <InputBalance
            autoFocus
            defaultValue={maxBalance}
            label={t<string>('unbond amount')}
            labelExtra={
              <FormatBalance
                label={<span className='label'>{t<string>('bonded')}</span>}
                value={maxBalance}
              />
            }
            maxValue={maxBalance}
            onChange={setMaxUnbond}
            withMax
          />
          {bondedBlocks?.gtn(0) && (
            <Static
              label={t<string>('on-chain bonding duration')}
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
          label={t<string>('Unbond')}
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
