// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { AddressMini, Expander, Spinner } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  nominators?: [string, number][];
}

function NominatedBy ({ nominators }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <td className='start all'>
      {nominators
        ? (nominators.length !== 0 && (
          <Expander summary={t<string>('Nominations ({{count}})', { replace: { count: formatNumber(nominators.length) } })}>
            {nominators.map(([who]): React.ReactNode =>
              <AddressMini
                key={who}
                value={who}
              />
            )}
          </Expander>
        ))
        : <Spinner variant='mini' />
      }
    </td>
  );
}

export default React.memo(NominatedBy);
