// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import BlockHeaders from './BlockHeaders';
import EventsRecent from './EventsRecent';
import Summary from './Summary';
import translate from './translate';

type Props = I18nProps & {};

class Main extends React.PureComponent<Props> {
  render () {
    const { t } = this.props;

    return (
      <>
        <Summary />
        <div className='explorer--Overview ui--flex-medium'>
          <div className='column'>
            <h1>{t('recent blocks')}</h1>
            <BlockHeaders />
          </div>
          <div className='column'>
            <h1>{t('recent events')}</h1>
            <EventsRecent />
          </div>
        </div>
      </>
    );
  }
}

export default translate(Main);
