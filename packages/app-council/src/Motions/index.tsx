// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { CardGrid } from '@polkadot/react-components';

import Motion from './Motion';
import Propose from './Propose';
import translate from '../translate';

interface Props extends I18nProps {
  motions?: Hash[];
}

function Proposals ({ motions, t }: Props): React.ReactElement<Props> {
  return (
    <CardGrid
      emptyText={t('No council motions')}
      headerText={t('Motions')}
      buttons={
        <Propose />
      }
    >
      {motions?.map((hash: Hash): React.ReactNode => (
        <Motion
          hash={hash.toHex()}
          key={hash.toHex()}
        />
      ))}
    </CardGrid>
  );
}

export default translate(Proposals);
