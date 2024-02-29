// Copyright 2017-2024 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import store from 'store';

import { settings } from '@polkadot/ui-settings';

import { useTranslation } from '../translate.js';
import BaseOverlay from './Base.js';

interface Props {
  className?: string;
}

function LocalFork ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  if (store.get('localFork') === settings.get().apiUrl) {
    return (
      <BaseOverlay
        className={className}
        icon='link'
        isBottom
        isFull
        type='info'
      >
        <div>
          {t('Local fork powered by ')}
          <a
            href='https://github.com/AcalaNetwork/chopsticks'
            rel='noreferrer'
            target='_blank'
          >
            Chopsticks
          </a>
          .
        </div>
      </BaseOverlay>
    );
  }

  return null;
}

export default React.memo(LocalFork);
