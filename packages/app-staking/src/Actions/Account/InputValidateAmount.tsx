// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesAll } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Icon } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import translate from '../../translate';

interface Props extends I18nProps {
  accountId: string | null;
  onError: (error: string | null) => void;
  value?: BN | null;
}

function ValidateAmount ({ accountId, onError, value, t }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const allBalances = useCall<DerivedBalancesAll>(api.derive.balances.all as any, [accountId]);
  const [error, setError] = useState<string | null>(null);

  useEffect((): void => {
    // don't show an error if the selected controller is the default
    // this applies when changing controller
    if (allBalances && value) {
      let newError: string | null = null;

      if (value.gt(allBalances.freeBalance)) {
        newError = t('The specified value is greater than your free balance. The node will bond the maximum amount available.');
      }

      if (error !== newError) {
        onError(newError);
        setError(newError);
      }
    }
  }, [allBalances, value]);

  if (!error) {
    return null;
  }

  return (
    <article className='warning'>
      <div><Icon name='warning sign' />{error}</div>
    </article>
  );
}

export default translate(ValidateAmount);
