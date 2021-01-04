// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { bool } from '@polkadot/types';
import type { ParaId } from '@polkadot/types/interfaces';

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

import Actions from './Actions';
import Parachains from './Parachains';
import Summary from './Summary';
import Upcoming from './Upcoming';

interface Props {
  className?: string;
}

const transformRegister = {
  transform: (value: bool): boolean => value.isTrue
};

function Overview (): React.ReactElement<Props> {
  const { api } = useApi();
  const paraIds = useCall<ParaId[]>(api.query.paras?.parachains);
  const upcomingIds = useCall<ParaId[]>(api.query.paras?.upcomingParas);
  const canRegister = useCall<boolean>(api.query.registrar?.parathreadsRegistrationEnabled, [], transformRegister);

  return (
    <>
      <Summary
        canRegister={canRegister}
        parachainCount={paraIds?.length}
        upcomingCount={upcomingIds?.length}
      />
      <Actions canRegister={canRegister} />
      {api.query.paras && (
        <>
          <Parachains
            canRegister={canRegister}
            ids={paraIds}
          />
          <Upcoming ids={upcomingIds} />
        </>
      )}
    </>
  );
}

export default React.memo(Overview);
