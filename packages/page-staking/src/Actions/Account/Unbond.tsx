// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountId, StakingLedger } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useState } from 'react';
import styled from 'styled-components';
import { InputAddress, InputBalance, Modal, Static, Toggle, TxButton } from '@polkadot/react-components';
import { BlockToTime } from '@polkadot/react-query';

import { useTranslation } from '../../translate';
import useUnbondDuration from '../useUnbondDuration';

interface Props {
  className?: string;
  controllerId?: AccountId | null;
  onClose: () => void;
  stakingLedger?: StakingLedger;
  stashId: string;
}

function Unbond ({ className = '', controllerId, onClose, stakingLedger, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const bondedBlocks = useUnbondDuration();
  const [maxBalance] = useState<BN | null>(stakingLedger?.active.unwrap() || null);
  const [maxUnbond, setMaxUnbond] = useState<BN | null>(null);
  const [withMax, setWithMax] = useState(false);

  return (
    <Modal
      className={`staking--Unbond ${className}`}
      header={t<string>('Unbond funds')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
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
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The stash and controller pair, here the controller will be used to send the transaction.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
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
                <BlockToTime blocks={bondedBlocks} />
              </Static>
            )}
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The funds will only be available for withdrawal after the unbonding period, however will not be part of the staked amount after the next validator election. You can follow the unlock countdown in the UI.')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={controllerId}
          icon='unlock'
          isDisabled={!((withMax ? maxBalance : maxUnbond)?.gtn(0))}
          label={t<string>('Unbond')}
          onStart={onClose}
          params={[withMax ? maxBalance : maxUnbond]}
          tx='staking.unbond'
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
