// Copyright 2017-2021 @canvas-ui/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi, useCall } from '@canvas-ui/react-hooks';
import React, { useEffect, useState } from 'react';

function WarmUp (): React.ReactElement {
  const { api, isApiReady } = useApi();
  const indexes = useCall<unknown>(isApiReady && api.derive.accounts?.indexes, []);
  const registrars = useCall<unknown>(isApiReady && api.query.identity?.registrars, []);
  const staking = null; // useCall<unknown>(isApiReady && api.derive.staking?.overview, []);
  const issuance = useCall<unknown>(isApiReady && api.query.balances?.totalIssuance, []);
  const [hasValues, setHasValues] = useState(false);

  useEffect((): void => {
    setHasValues(!!indexes || !!issuance || !!registrars || !!staking);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`apps--api-warm ${hasValues.toString()}`} />
  );
}

export default React.memo(WarmUp);
