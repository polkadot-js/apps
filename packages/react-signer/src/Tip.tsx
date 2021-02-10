// Copyright 2017-2021 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';

import { InputBalance, Modal, Toggle } from '@polkadot/react-components';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  onChange: (tip: BN) => void;
}

function Tip ({ className, onChange }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [tip, setTip] = useState(BN_ZERO);
  const [showTip, setShowTip] = useState(false);

  useEffect((): void => {
    onChange(showTip ? tip : BN_ZERO);
  }, [onChange, showTip, tip]);

  return (
    <Modal.Columns className={className}>
      <Modal.Column>
        <Toggle
          className='tipToggle'
          label={
            showTip
              ? t<string>('Include an optional tip for faster processing')
              : t<string>('Do not include a tip for the block author')
          }
          onChange={setShowTip}
          value={showTip}
        />
        {showTip && (
          <InputBalance
            help={t<string>('Add a tip to this extrinsic, paying the block author for greater priority')}
            isZeroable
            label={t<string>('Tip (optional)')}
            onChange={setTip}
          />
        )}
      </Modal.Column>
      <Modal.Column>
        <p>{t<string>('Adding an optional tip to the transaction could allow for higher priority, especially when the chain is busy.')}</p>
      </Modal.Column>
    </Modal.Columns>
  );
}

export default React.memo(Tip);
