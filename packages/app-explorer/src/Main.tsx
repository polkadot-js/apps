// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { KeyedEvent } from './types';

import React from 'react';
import styled from 'styled-components';

import BlockHeaders from './BlockHeaders';
import Events from './Events';
import Query from './Query';
import Summary from './Summary';
import translate from './translate';

type Props = I18nProps & {
  events: Array<KeyedEvent>
};

const Wrapper = styled.div`
  .column {
    flex: 0 0 50%;
    min-width: 0;
    padding: 0 1em 1em;
  }
`;

class Main extends React.PureComponent<Props> {
  render () {
    const { events, t } = this.props;

    return (
      <>
        <Query />
        <Summary />
        <Wrapper className='ui--flex-medium'>
          <div className='column'>
            <h1>{t('recent blocks')}</h1>
            <BlockHeaders />
          </div>
          <div className='column'>
            <h1>{t('recent events')}</h1>
            <Events events={events} />
          </div>
        </Wrapper>
      </>
    );
  }
}

export default translate(Main);
