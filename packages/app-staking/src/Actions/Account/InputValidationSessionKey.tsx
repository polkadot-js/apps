// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React, { useEffect, useState } from 'react';
import { Icon } from '@polkadot/react-components';

import translate from '../../translate';

interface Props extends I18nProps {
  controllerId: string;
  onError: (error: string | null) => void;
  sessionId: string | null;
  stashId: string;
}

function ValidateSessionEd25519 ({ onError, sessionId, stashId, t }: Props): React.ReactElement<Props> | null {
  const [error, setError] = useState<string | null>(null);

  useEffect((): void => {
    let newError = null;

    if (sessionId === stashId) {
      newError = t('For fund security, your session key should not match your stash key.');
    }

    if (error !== newError) {
      onError(newError);
      setError(newError);
    }
  }, [sessionId, stashId]);

  if (!error) {
    return null;
  }

  return (
    <article className='warning'>
      <div><Icon name='warning sign' />{error}</div>
    </article>
  );
}

export default translate(ValidateSessionEd25519);
