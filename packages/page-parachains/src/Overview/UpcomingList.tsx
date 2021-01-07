// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Upcoming from './Upcoming';

interface Props {
  ids?: ParaId[];
}

function UpcomingList ({ ids }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('upcoming'), 'start'],
    [undefined, 'all'],
    [t('parachain'), 'start']
  ]);

  return (
    <Table
      empty={ids && t<string>('There are no upcoming parachains')}
      header={headerRef.current}
    >
      {ids?.map((id): React.ReactNode => (
        <Upcoming
          id={id}
          key={id.toString()}
        />
      ))}
    </Table>
  );
}

export default React.memo(UpcomingList);
