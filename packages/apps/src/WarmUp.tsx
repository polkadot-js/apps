// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

function WarmUp (): React.ReactElement {
  const { api, isApiReady } = useApi();
  const fees = useCall<unknown>(isApiReady && api.derive.balances?.fees, []);
  const indexes = useCall<unknown>(isApiReady && api.derive.accounts?.indexes, []);
  const registrars = useCall<unknown>(isApiReady && api.query.identity?.registrars, []);
  const staking = null; // useCall<unknown>(isApiReady && api.derive.staking?.overview, []);
  const [hasValues, setHasValues] = useState(false);

  useEffect((): void => {
    setHasValues(!!fees || !!indexes || !!registrars || !!staking);
  }, []);

  return (
    <div className={`apps--api-warm ${hasValues}`} />
  );
}

export default React.memo(WarmUp);
