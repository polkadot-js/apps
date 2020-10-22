import { AppProps as Props } from '@polkadot/react-components/types';
import { Columar, Column } from '@polkadot/react-components';

import React, { useMemo } from 'react';

import Swap from './Swap';
import Status from './Status';
import { useTranslation } from './translate';

function TokenSwapApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  return (
    <main className='master-submit--App'>
      <header>
        &nbsp;
      </header>
      <Columar>
        <Column>
          <Swap />
        </Column>
        <Column>
          <Status />
        </Column>
      </Columar>
    </main>
  );
}

export default React.memo(TokenSwapApp);
