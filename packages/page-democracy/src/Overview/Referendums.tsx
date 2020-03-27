// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveReferendumExt } from '@polkadot/api-derive/types';

import React from 'react';
import { Spinner, Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Referendum from './Referendum';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function Referendums ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const referendums = useCall<DeriveReferendumExt[]>(api.derive.democracy.referendums, []);

  return (
    <div className={`proposalSection ${className}`}>
      <h1>{t('referenda')}</h1>
      {referendums
        ? referendums.length
          ? (
            <Table>
              <Table.Body>
                {referendums.map((referendum): React.ReactNode => (
                  <Referendum
                    key={referendum.index.toString()}
                    value={referendum}
                  />
                ))}
              </Table.Body>
            </Table>
          )
          : t('No active referendums')
        : <Spinner />
      }
    </div>
  );
}

export default React.memo(Referendums);
