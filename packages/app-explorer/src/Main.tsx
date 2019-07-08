// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { KeyedEvent } from './types';

import React from 'react';
import { Columar, Column } from '@polkadot/ui-app';

import BlockHeaders from './BlockHeaders';
import Events from './Events';
import Query from './Query';
import Summary from './Summary';
import translate from './translate';

type Props = I18nProps & {
  events: Array<KeyedEvent>
};

class Main extends React.PureComponent<Props> {
  render () {
    const { events, t } = this.props;

    return (
      <>
        <Query />
        <Summary />
        <Columar>
          <Column headerText={t('recent blocks')}>
            <BlockHeaders />
          </Column>
          <Column headerText={t('recent events')}>
            <Events events={events} />
          </Column>
        </Columar>
      </>
    );
  }
}

export default translate(Main);
