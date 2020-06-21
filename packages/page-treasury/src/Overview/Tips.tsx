// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Tip from './Tip';

interface Props {
  className?: string;
  hashes?: string[] | null;
  isMember: boolean;
  members: string[];
}

function Tips ({ className = '', hashes, isMember, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);

  const header = useMemo(() => [
    [t('tips'), 'start'],
    [t('finder'), 'address'],
    [t('fee')],
    [t('reason'), 'start'],
    [],
    [undefined, 'mini'],
    []
  ], [t]);

  return (
    <Table
      className={className}
      empty={hashes && t<string>('No open tips')}
      header={header}
    >
      {hashes?.map((hash): React.ReactNode => (
        <Tip
          bestNumber={bestNumber}
          hash={hash}
          isMember={isMember}
          key={hash}
          members={members}
        />
      ))}
    </Table>
  );
}

export default React.memo(Tips);
