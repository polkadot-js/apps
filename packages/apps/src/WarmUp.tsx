// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

function WarmUp (): React.ReactElement {
  const { api, apiIdentity, isApiReady } = useApi();
  const indexes = useCall<unknown>(isApiReady && api.derive.accounts?.indexes);
  const registrars = useCall<unknown>(isApiReady && apiIdentity.query.identity?.registrars);
  const issuance = useCall<unknown>(isApiReady && api.query.balances?.totalIssuance);
  const [hasValues, setHasValues] = useState(false);

  useEffect((): void => {
    setHasValues(!!indexes || !!issuance || !!registrars);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`apps--api-warm ${hasValues.toString()}`} />
  );
}

export default React.memo(WarmUp);
