// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { EventRecord } from '@polkadot/types';
import { Column } from '@polkadot/ui-app';

import EventsDisplay from '../Events';
import translate from '../translate';

type Props = I18nProps & {
  value?: Array<EventRecord>
};

class Events extends React.PureComponent<Props> {
  render () {
    const { t, value } = this.props;

    if (!value || !value.length) {
      return null;
    }

    const events = value.map((record, index) => ({
      key: `${index}`, record
    }));

    return (
      <Column headerText={t('events')}>
        <EventsDisplay
          eventClassName='explorer--BlockByHash-block'
          events={events}
        />
      </Column>
    );
  }
}

export default translate(Events);
