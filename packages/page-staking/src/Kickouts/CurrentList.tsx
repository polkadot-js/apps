// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';

import { Table } from '@polkadot/react-components';

import Filtering from '../Filtering';
import { useTranslation } from '../translate';
import Address from './Address';
import { KickOutEvent } from './index';

interface Props {
  kicks: KickOutEvent[] | undefined,
}

function CurrentList ({ kicks }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [nameFilter, setNameFilter] = useState<string>('');

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
        kicks !== undefined && kicks.length === 0 && t<string>('No kick-out events found in the past 84 eras')
      }
      emptySpinner={
        <>
          {kicks === undefined && <div>{t<string>('Retrieving kick-out events')}</div>}
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
      {kicks?.map(({ address, era, kickoutReason }): React.ReactNode => (
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
