// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, StakingLedger } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useState } from 'react';
import styled from 'styled-components';

import { InputAddress, InputBalance, Modal, Static, Toggle, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';

import { useTranslation } from '../../translate';
import useUnbondDuration from '../useUnbondDuration';

interface Props {
  controllerId?: AccountId | null;
  onClose: () => void;
  stakingLedger?: StakingLedger;
  stashId: string;
}

function Unbond ({ controllerId, onClose, stakingLedger, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bondedBlocks = useUnbondDuration();
  const [maxBalance] = useState<BN | null>(() => stakingLedger?.active?.unwrap() || null);
  const [maxUnbond, setMaxUnbond] = useState<BN | null>(null);
  const [withMax, setWithMax] = useState(false);

  return (
    <Modal
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
            help={t<string>('The amount of funds to unbond, this is adjusted using the bonded funds on the stash account.')}
            isDisabled={withMax}
            key={`unbondAmount-${withMax.toString()}`}
            label={t<string>('unbond amount')}
            maxValue={maxBalance}
            onChange={setMaxUnbond}
            withMax
          >
            <Toggle
              isOverlay
              label={t<string>('all bonded')}
              onChange={setWithMax}
              value={withMax}
            />
          </InputBalance>
          {bondedBlocks?.gtn(0) && (
            <Static
              help={t<string>('The bonding duration for any staked funds. After this period needs to be withdrawn.')}
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
          isDisabled={!((withMax ? maxBalance : maxUnbond)?.gtn(0))}
          label={t<string>('Unbond')}
          onStart={onClose}
          params={[withMax ? maxBalance : maxUnbond]}
          tx={api.tx.staking.unbond}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(Unbond)`
  .staking--Unbond--max > div {
    justify-content: flex-end;

    & .column {
      flex: 0;
    }
  }
`);
