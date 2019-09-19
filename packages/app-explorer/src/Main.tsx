// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { KeyedEvent } from './types';

import React from 'react';
import { HeaderExtended } from '@polkadot/api-derive';
import { Columar, Column } from '@polkadot/react-components';

import BlockHeaders from './BlockHeaders';
import Events from './Events';
import Query from './Query';
import Summary from './Summary';
import translate from './translate';

interface Props extends I18nProps {
  events: KeyedEvent[];
  headers: HeaderExtended[];
}

function Main ({ events, headers, t }: Props): React.ReactElement<Props> {
  return (
    <>
      <Query />
      <Summary />
      <Columar>
        <Column headerText={t('recent blocks')}>
          <BlockHeaders headers={headers} />
        </Column>
        <Column headerText={t('recent events')}>
          <Events events={events} />
        </Column>
      </Columar>
    </>
  );
}

export default translate(Main);
