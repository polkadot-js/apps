// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ValidateInfo } from './types';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Dropdown, InputAddress, InputNumber, MarkError, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN, BN_HUNDRED as MAX_COMM, BN_ONE, bnMax, isFunction } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  controllerId: string;
  minCommission?: BN;
  onChange: (info: ValidateInfo) => void;
  stashId: string;
  withFocus?: boolean;
  withSenders?: boolean;
}

const COMM_MUL = new BN(1e7);

function Validate ({ className = '', controllerId, minCommission, onChange, stashId, withFocus, withSenders }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [commission, setCommission] = useState(BN_ONE);
  const [allowNoms, setAllowNoms] = useState(true);
  const defaultComm = useMemo(
    () => minCommission
      ? bnMax(minCommission.div(COMM_MUL), BN_ONE)
      : BN_ONE,
    [minCommission]
  );

  const blockedOptions = useRef([
    { text: t<string>('Yes, allow nominations'), value: true },
    { text: t<string>('No, block all nominations'), value: false }
  ]);

  useEffect((): void => {
    try {
      onChange({
        validateTx: api.tx.staking.validate({
          blocked: !allowNoms,
          commission
        })
      });
    } catch {
      onChange({ validateTx: null });
    }
  }, [api, allowNoms, commission, onChange]);

  const _setCommission = useCallback(
    (value?: BN) => value && setCommission(
      value.isZero()
        ? BN_ONE // small non-zero set to avoid isEmpty
        : value.mul(COMM_MUL)
    ),
    []
  );

  const commErr = !!minCommission && commission.lt(minCommission);

  return (
    <div className={className}>
      {withSenders && (
        <Modal.Columns hint={t<string>('The stash and controller pair. This transaction, managing preferences, will be sent from the controller.')}>
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
      )}
      <Modal.Columns hint={t<string>('The commission is deducted from all rewards before the remainder is split with nominators.')}>
        <InputNumber
          autoFocus={withFocus}
          defaultValue={defaultComm}
          isError={commErr}
          isZeroable
          label={t<string>('reward commission percentage')}
          maxValue={MAX_COMM}
          onChange={_setCommission}
        />
        {commErr && (
          <MarkError content={t<string>('The commission is below the on-chain minimum of {{p}}%', { replace: { p: (minCommission.mul(MAX_COMM).div(COMM_MUL).toNumber() / 100).toFixed(2) } })} />
        )}
      </Modal.Columns>
      {isFunction(api.tx.staking.kick) && (
        <Modal.Columns hint={t<string>('The validator can block any new nominations. By default it is set to allow all nominations.')}>
          <Dropdown
            defaultValue={true}
            label={t<string>('allows new nominations')}
            onChange={setAllowNoms}
            options={blockedOptions.current}
          />
        </Modal.Columns>
      )}
    </div>
  );
}

export default React.memo(Validate);
