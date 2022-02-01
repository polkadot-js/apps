// Copyright 2017-2022 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';
import { BN_ZERO } from '@polkadot/util';

import React, { useEffect, useState } from 'react';

import { InputBalance, Modal } from '@polkadot/react-components';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  onChange: (app_id: u32) => void;
}

function AppId({ className, onChange }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [app_id, setAppId] = useState<u32>(0);

  return (
    <Modal.Columns
      className={className}
      hint={t<string>('Application Id.')}
    >
      <InputBalance
          help={t<string>('Specify different Application Id for this Tx')}
          isZeroable
          label={t<string>('App Id')}
          onChange={setAppId}
       />
    </Modal.Columns>
  );
}

export default React.memo(AppId);
