// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedReferendum } from '@polkadot/api-derive/types';
import { I18nProps as Props } from '@polkadot/react-components/types';

import React from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Referendum from './Referendum';
import translate from '../translate';

function Referendums ({ className, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const referendums = useCall<DerivedReferendum[]>(api.derive.democracy.referendums, []);

  return (
    <div className={`proposalSection ${className}`}>
      <h1>{t('referenda')}</h1>
      {referendums?.length
        ? (
          <Table>
            <Table.Body>
              {referendums.map((referendum): React.ReactNode => (
                <Referendum
                  idNumber={referendum.index}
                  key={referendum.index.toString()}
                  value={referendum}
                />
              ))}
            </Table.Body>
          </Table>
        )
        : t('No active referendums')
      }
    </div>
  );
}

export default translate(Referendums);
