/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/react-components/types';

import React from 'react';
import { ReferendumInfoExtended } from '@polkadot/api-derive/type';
import { Option } from '@polkadot/types';
import { useApi, trackStream } from '@polkadot/react-hooks';

import Referendum from './Referendum';
import translate from '../translate';

function Referendums ({ className, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const referendums = trackStream<Option<ReferendumInfoExtended>[]>(api.derive.democracy.referendums, []);

  return (
    <div className={`proposalSection ${className}`}>
      <h1>{t('referenda')}</h1>
      {
        referendums?.length
          ? referendums
            .filter((opt): boolean => opt.isSome)
            .map((opt): ReferendumInfoExtended => opt.unwrap())
            .map((referendum): React.ReactNode => (
              <Referendum
                idNumber={referendum.index}
                key={referendum.index.toString()}
                value={referendum}
              />
            ))
          : t('No available referendums')
      }
    </div>
  );
}

export default translate(Referendums);
