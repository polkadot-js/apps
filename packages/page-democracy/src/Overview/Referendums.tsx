// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveReferendumExt } from '@polkadot/api-derive/types';

import React, { useMemo } from 'react';
import { Table } from '@polkadot/react-components';

import Referendum from './Referendum';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
  referendums?: DeriveReferendumExt[];
}

function Referendums ({ className = '', referendums }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const header = useMemo(() => [
    [t('referenda'), 'start', 2],
    [t('remaining'), 'ui--media-1200'],
    [t('activate'), 'ui--media-1400'],
    [t('turnout'), 'ui--media-1400'],
    [t('aye')],
    [t('nay')],
    [undefined, undefined, 2],
    [undefined, 'badge'],
    [undefined, 'mini ui--media-1000']
  ], [t]);

  return (
    <Table
      className={className}
      empty={referendums && t<string>('No active referendums')}
      header={header}
    >
      {referendums?.map((referendum): React.ReactNode => (
        <Referendum
          key={referendum.index.toString()}
          value={referendum}
        />
      ))}
    </Table>
  );
}

export default React.memo(Referendums);
