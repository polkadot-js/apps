// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import { AddressMini } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  voters: AccountId[];
}

function Voters ({ voters }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <details>
      <summary>
        {t('Voters ({{count}})', {
          replace: {
            count: voters.length
          }
        })}
      </summary>
      {voters.map((who): React.ReactNode =>
        <AddressMini
          key={who.toString()}
          value={who}
          withLockedVote
        />
      )}
    </details>
  );
}

export default React.memo(Voters);
