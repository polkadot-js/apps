// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

function WarmUp (): React.ReactElement {
  const { api, isApiReady } = useApi();
  const indexes = useCall<unknown>(isApiReady && api.derive.accounts?.indexes, []);
  const registrars = useCall<unknown>(isApiReady && api.query.identity?.registrars, []);
  const staking = null; // useCall<unknown>(isApiReady && api.derive.staking?.overview, []);
  const issuance = useCall<unknown>(isApiReady && api.query.balances?.totalIssuance, []);
  const historyDepth = useCall<unknown>(api.query.staking?.historyDepth, []);
  const [hasValues, setHasValues] = useState(false);

  useEffect((): void => {
    setHasValues(!!historyDepth || !!indexes || !!issuance || !!registrars || !!staking);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`apps--api-warm ${hasValues.toString()}`} />
  );
}

export default React.memo(WarmUp);
