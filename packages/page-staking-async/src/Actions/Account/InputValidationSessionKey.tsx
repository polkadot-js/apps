// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { I18nProps } from '@polkadot/react-components/types';

import React, { useEffect, useState } from 'react';

import { MarkWarning } from '@polkadot/react-components';

import { useTranslation } from '../../translate.js';

interface Props extends I18nProps {
  controllerId: string;
  onError: (error: string | null) => void;
  sessionId: string | null;
  stashId: string;
}

function ValidateSessionEd25519 ({ onError, sessionId, stashId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  useEffect((): void => {
    let newError: string | null = null;

    if (sessionId === stashId) {
      newError = t('For fund security, your session key should not match your stash key.');
    }

    onError(newError);
    setError((error) => error !== newError ? newError : error);
  }, [onError, sessionId, stashId, t]);

  if (!error) {
    return null;
  }

  return (
    <MarkWarning content={error} />
  );
}

export default React.memo(ValidateSessionEd25519);
