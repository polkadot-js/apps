// Copyright 2017-2019 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { CardGrid } from '@polkadot/react-components';

import Proposal from './Proposal';
import translate from '../translate';

interface Props extends I18nProps {
  proposals?: Hash[];
}

function Proposals ({ proposals, t }: Props): React.ReactElement<Props> {
  return (
    <CardGrid
      emptyText={t('No committee proposals')}
      headerText={t('Proposals')}
      // buttons={<Propose />}
    >
      {proposals?.map((hash: Hash): React.ReactNode => (
        <Proposal
          hash={hash.toHex()}
          key={hash.toHex()}
        />
      ))}
    </CardGrid>
  );
}

export default translate(Proposals);
