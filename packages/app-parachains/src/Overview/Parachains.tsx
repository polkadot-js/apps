/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { Column } from '@polkadot/react-components';
import { withCalls } from '@polkadot/react-api';

import translate from '../translate';
import Parachain from './Parachain';

interface Props extends I18nProps {
  parachains_parachains?: BN[];
}

function Parachains ({ parachains_parachains, t }: Props): React.ReactElement<Props> {
  return (
    <Column
      emptyText={t('no deployed parachains')}
      headerText={t('parachains')}
    >
      {parachains_parachains && parachains_parachains.map((paraId): React.ReactNode =>
        <Parachain key={paraId.toString()} paraId={paraId} />
      )}
    </Column>
  );
}

export default translate(
  withCalls<Props>(
    'query.parachains.parachains'
  )(Parachains)
);
