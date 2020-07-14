// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveParachain } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React from 'react';
import { Button, Icon, Spinner } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Parachains from './Parachains';
import Register from './Register';
import Summary from './Summary';

import { useTranslation } from '../translate';

interface Props {
  isMine?: boolean;
  sudoKey?: string;
}

function Overview ({ isMine, sudoKey }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const parachains = useCall<DeriveParachain[]>(api.derive.parachains.overview) || null;
  const nextFreeId = useCall<BN>(api.query.registrar.nextFreeId);

  if (!parachains) {
    return (
      <Spinner />
    );
  }

  const actions = isMine && sudoKey
    ? (
      <Button.Group>
        <Register
          nextFreeId={nextFreeId}
          sudoKey={sudoKey}
        />
      </Button.Group>
    )
    : null;

  if (!!parachains && !parachains.length) {
    return (
      <>
        {actions}
        <article className='error padded'>
          <div>
            <Icon icon='ban' />
            {t<string>('There are no registered parachains')}
          </div>
        </article>
      </>
    );
  }

  return (
    <>
      {actions}
      <Summary
        nextFreeId={nextFreeId}
        parachainCount={parachains.length}
      />
      <Parachains
        parachains={parachains}
      />
    </>
  );
}

export default React.memo(Overview);
