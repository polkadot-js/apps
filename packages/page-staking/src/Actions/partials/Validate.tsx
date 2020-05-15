// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ValidateInfo } from './types';

import BN from 'bn.js';
import React, { useCallback } from 'react';
import { InputAddress, InputNumber, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  controllerId: string;
  onChange: (info: ValidateInfo) => void;
  stashId: string;
  withSenders?: boolean;
}

const COMM_MUL = new BN(10000000);
const MAX_COMM = new BN(100);
const ZERO = new BN(0);

function Validate ({ className, controllerId, onChange, stashId, withSenders }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  const _setCommission = useCallback(
    (commission?: BN) => onChange({
      validateTx: api.tx.staking.validate({ commission: (commission || ZERO).mul(COMM_MUL) })
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
              label={t('stash account')}
            />
            <InputAddress
              defaultValue={controllerId}
              isDisabled
              label={t('controller account')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('The stash and controller pair. This transaction, managing preferences, will be sent from the controller.')}</p>
          </Modal.Column>
        </Modal.Columns>
      )}
      <Modal.Columns>
        <Modal.Column>
          <InputNumber
            help={t('The percentage reward (0-100) that should be applied for the validator')}
            isZeroable
            label={t('reward commission percentage')}
            maxValue={MAX_COMM}
            onChange={_setCommission}
          />
        </Modal.Column>
        <Modal.Column>
          <p>{t('The commission is deducted from all rewards before the remainder is split with nominators.')}</p>
        </Modal.Column>
      </Modal.Columns>
    </div>
  );
}

export default React.memo(Validate);
