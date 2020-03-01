// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { Column } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import translate from '../translate';
import Parachain from './Parachain';

function Parachains ({ t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const parachains = useCall<BN[]>(api.query.registrar.parachains || api.query.parachains.parachains, []);

  return (
    <Column
      emptyText={t('no deployed parachains')}
      headerText={t('parachains')}
    >
      {parachains?.map((paraId): React.ReactNode => (
        <Parachain
          key={paraId.toString()}
          paraId={paraId}
        />
      ))}
    </Column>
  );
}

export default translate(Parachains);
