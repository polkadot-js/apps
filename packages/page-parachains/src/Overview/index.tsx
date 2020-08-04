// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveParachain } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React from 'react';
import { Button } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Parachains from './Parachains';
import Register from './Register';
import Summary from './Summary';

interface Props {
  isMine?: boolean;
  sudoKey?: string;
}

function Overview ({ isMine, sudoKey }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const parachains = useCall<DeriveParachain[]>(api.derive.parachains.overview);
  const nextFreeId = useCall<BN>(api.query.registrar.nextFreeId);

  return (
    <>
      <Summary
        nextFreeId={nextFreeId}
        parachainCount={parachains?.length || 0}
      />
      <Button.Group>
        <Register
          isDisabled={!isMine}
          nextFreeId={nextFreeId}
          sudoKey={sudoKey}
        />
      </Button.Group>
      <Parachains parachains={parachains} />
    </>
  );
}

export default React.memo(Overview);
