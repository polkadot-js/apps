// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EventRecord } from '@polkadot/types/interfaces';

import React from 'react';
import { Column } from '@polkadot/react-components';

import EventsDisplay from '../Events';
import { useTranslation } from '../translate';

interface Props {
  value?: EventRecord[];
}

function Events ({ value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

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

export default React.memo(Events);
