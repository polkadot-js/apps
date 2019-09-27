// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EventRecord } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Column } from '@polkadot/react-components';

import EventsDisplay from '../Events';
import translate from '../translate';

interface Props extends I18nProps {
  value?: EventRecord[];
}

function Events ({ value, t }: Props): React.ReactElement<Props> | null {
  if (!value || !value.length) {
    return null;
  }

  return (
    <Column headerText={t('events')}>
      <EventsDisplay
        eventClassName='explorer--BlockByHash-block'
        events={
          value.map((record, index): { key: string; record: EventRecord } => ({
            key: `${index}`, record
          }))
        }
      />
    </Column>
  );
}

export default translate(Events);
