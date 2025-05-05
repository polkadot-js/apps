// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useEffect, useState } from 'react';

import { MarkWarning } from '@polkadot/react-components';
import { BN_TEN } from '@polkadot/util';

import { useTranslation } from '../../translate.js';

interface Props {
  unstakeThreshold: BN | undefined;
  onError: (error: string | null) => void;
}

function InputValidationUnstakeThreshold ({ onError, unstakeThreshold }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  useEffect((): void => {
    if (unstakeThreshold) {
      let newError: string | null = null;

      if (unstakeThreshold.ltn(0)) {
        newError = t('The Threshold must be a positive number');
      } else if (unstakeThreshold.gt(BN_TEN)) {
        newError = t('The Threshold must lower than 11');
      }

      onError(newError);
      setError((error) => error !== newError ? newError : error);
    }
  }, [onError, t, unstakeThreshold]);

  if (!error) {
    return null;
  }

  return (
    <MarkWarning content={error} />
  );
}

export default React.memo(InputValidationUnstakeThreshold);
