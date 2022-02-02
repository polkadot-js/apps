// Copyright 2017-2022 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';
import { BN_ZERO } from '@polkadot/util';

import React, { useEffect, useState } from 'react';

import { InputNumber, Modal } from '@polkadot/react-components';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  onChange: (app_id: u32) => void;
}

function AppId({ className, onChange }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <Modal.Columns
      className={className}
      hint={t<string>('Application Id.')}
    >
      <InputNumber
          help={t<string>('Specify different Application Id for this Tx')}
          isZeroable
          label={t<string>('App Id')}
          onChange={onChange}
       />
    </Modal.Columns>
  );
}

export default React.memo(AppId);
