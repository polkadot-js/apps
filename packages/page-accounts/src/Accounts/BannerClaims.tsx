// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import useClaimCounter from '@polkadot/app-claims/useCounter'; // exceptionally CRAP idea

import { useTranslation } from '../translate';
import Banner from './Banner';

function BannerExtension (): React.ReactElement | null {
  const claimCount = useClaimCounter();
  const { t } = useTranslation();

  if (!claimCount) {
    return null;
  }

  return (
    <Banner type='error'>
      <p>{t<string>('You have {{claimCount}} accounts that need attestations. Use the Claim Tokens app on the left navigation bar to complete the process. Until you do, your balances for those accounts will not be reflected.', { replace: { claimCount } })}&nbsp;<a href='#/claims'>{t<string>('Claim tokens...')}</a></p>
    </Banner>
  );
}

export default React.memo(BannerExtension);
