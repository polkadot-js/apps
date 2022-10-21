// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useRef, useState } from 'react';

import { Table } from '@polkadot/react-components';
import { useLoadingDelay } from '@polkadot/react-hooks';

import Filtering from '../Filtering';
import { useTranslation } from '../translate';
import Address from './Address';
import { KickOutEvent } from './index';

interface Props {
  kicks: KickOutEvent[],
}

function CurrentList ({ kicks }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [nameFilter, setNameFilter] = useState<string>('');

  const isLoading = useLoadingDelay();

  const kickoutList = useMemo(
    () => isLoading
      ? []
      : kicks,
    [isLoading, kicks]
  );

  const headerRef = useRef(
    [
      [t('kick-outs'), 'start', 1],
      [t('era'), 'expand'],
      [t('kick-out reason'), 'expand'],
      [t('stats'), 'expand']

    ]
  );

  return (
    <Table
      empty={
        kickoutList && t<string>('No kick-out events found')
      }
      emptySpinner={
        <>
          {!kicks && <div>{t<string>('Retrieving kicks')}</div>}
          {!kickoutList && <div>{t<string>('Preparing kick-out list')}</div>}
        </>
      }
      filter={
        <div className='staking--optionsBar'>
          <Filtering
            nameFilter={nameFilter}
            setNameFilter={setNameFilter}
          />
        </div>
      }
      header={headerRef.current}
    >
      {kickoutList.map(({ address, era, kickoutReason }): React.ReactNode => (
        <Address
          address={address}
          era={era}
          filterName={nameFilter}
          key={address}
          kickoutReason={kickoutReason}
        />
      ))}
    </Table>
  );
}

export default React.memo(CurrentList);
