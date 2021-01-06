// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ValidateInfo } from './types';

import BN from 'bn.js';
import React, { useCallback } from 'react';

import { InputAddress, InputNumber, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN_HUNDRED as MAX_COMM } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  controllerId: string;
  onChange: (info: ValidateInfo) => void;
  stashId: string;
  withSenders?: boolean;
}

const COMM_MUL = new BN(1e7);

function Validate ({ className = '', controllerId, onChange, stashId, withSenders }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  const _setCommission = useCallback(
    (value?: BN) => onChange({
      validateTx: value && api.tx.staking.validate({
        commission: value.isZero()
          ? 1 // small non-zero set to avoid isEmpty
          : value.mul(COMM_MUL)
      })
    }),
    [api, onChange]
  );

  return (
    <div className={className}>
      {withSenders && (
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
            <p>{t<string>('The stash and controller pair. This transaction, managing preferences, will be sent from the controller.')}</p>
          </Modal.Column>
        </Modal.Columns>
      )}
      <Modal.Columns>
        <Modal.Column>
          <InputNumber
            help={t<string>('The percentage reward (0-100) that should be applied for the validator')}
            isZeroable
            label={t<string>('reward commission percentage')}
            maxValue={MAX_COMM}
            onChange={_setCommission}
          />
        </Modal.Column>
        <Modal.Column>
          <p>{t<string>('The commission is deducted from all rewards before the remainder is split with nominators.')}</p>
        </Modal.Column>
      </Modal.Columns>
    </div>
  );
}

export default React.memo(Validate);
