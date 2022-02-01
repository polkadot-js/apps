// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ValidateInfo } from './types';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Dropdown, InputAddress, InputNumber, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN, BN_HUNDRED as MAX_COMM, isFunction } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  controllerId: string;
  onChange: (info: ValidateInfo) => void;
  stashId: string;
  withFocus?: boolean;
  withSenders?: boolean;
}

const COMM_MUL = new BN(1e7);

function Validate ({ className = '', controllerId, onChange, stashId, withFocus, withSenders }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [commission, setCommission] = useState<BN | number>(1);
  const [allowNoms, setAllowNoms] = useState(true);

  const blockedOptions = useRef([
    { text: t('Yes, allow nominations'), value: true },
    { text: t('No, block all nominations'), value: false }
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
        ? 1 // small non-zero set to avoid isEmpty
        : value.mul(COMM_MUL)
    ),
    []
  );

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
          help={t<string>('The percentage reward (0-100) that should be applied for the validator')}
          isZeroable
          label={t<string>('reward commission percentage')}
          maxValue={MAX_COMM}
          onChange={_setCommission}
        />
      </Modal.Columns>
      {isFunction(api.tx.staking.kick) && (
        <Modal.Columns hint={t<string>('The validator can block any new nominations. By default it is set to allow all nominations.')}>
          <Dropdown
            defaultValue={true}
            help={t<string>('Does this validator allow nominations or is it blocked for all')}
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
