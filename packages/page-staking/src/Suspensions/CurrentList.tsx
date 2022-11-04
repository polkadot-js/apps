// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';

import { Table } from '@polkadot/react-components';

import Filtering from '../Filtering';
import { useTranslation } from '../translate';
import Address from './Address';
import { SuspensionEvent } from './index';

interface Props {
  suspensions: SuspensionEvent[] | undefined,
}

function CurrentList ({ suspensions }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [nameFilter, setNameFilter] = useState<string>('');

  const headerRef = useRef(
    [
      [t('suspensions'), 'start', 1],
      [t('era'), 'expand'],
      [t('reason'), 'expand'],
      [t('stats'), 'expand']

    ]
  );

  return (
    <Table
      empty={
        suspensions !== undefined && suspensions.length === 0 && t<string>('No suspensions events found in the past 84 eras')
      }
      emptySpinner={
        <>
          {suspensions === undefined && <div>{t<string>('Retrieving suspensions events')}</div>}
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
      {suspensions?.map(({ address, era, suspensionReason }): React.ReactNode => (
        <Address
          address={address}
          era={era}
          filterName={nameFilter}
          key={address}
          suspensionReason={suspensionReason}
        />
      ))}
    </Table>
  );
}

export default React.memo(CurrentList);
