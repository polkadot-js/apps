// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PromiseContract as Contract } from '@polkadot/api-contract';
import { ComponentProps as Props } from './types';

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, ContractCard } from '@canvas-ui/react-components';
import { useApi } from '@canvas-ui/react-hooks';
import { getContractForAddress } from '@canvas-ui/react-util';

import { useTranslation } from './translate';

function Contracts ({ accounts, basePath, className, contracts: contractAddresses, hasContracts, navigateTo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const contracts = useMemo(
    (): Contract[] | null => {
      return accounts && contractAddresses && contractAddresses
        .map((address): Contract | null => getContractForAddress(api, address))
        .filter((contract: Contract | null): boolean => !!contract) as Contract[];
    },
    [accounts, api, contractAddresses]
  );

  return (
    <div className={className}>
      <header>
        <h1>{t(hasContracts ? 'Execute Contract' : 'No contracts available')}</h1>
        <div className='instructions'>
          {hasContracts
            ? t<string>('Call messages on deployed contracts.')
            : (
              <>
                {t<string>('You can add an existing contract by')}
                {' '}
                <Link to={'/execute/add'}>
                  {t<string>('adding its address')}
                </Link>
                {`. ${t<string>('Or deploy from a')} `}
                <Link to={'/deploy'}>
                  {t<string>('code bundle')}
                </Link>
                {'.'}
              </>
            )
          }
        </div>
      </header>
      <section>
        <div className='content'>
          {hasContracts && (
            <h3>{t<string>('Deployed Contracts')}</h3>
          )}
          {contracts?.map((contract): React.ReactNode => ((
            <ContractCard
              basePath={basePath}
              contract={contract}
              key={contract.address.toString()}
              navigateTo={navigateTo}
            />
          )))}
          <Button.Group>
            <Button
              label={t<string>('Add An Existing Contract')}
              onClick={navigateTo.executeAdd}
            />
          </Button.Group>
        </div>
      </section>
    </div>
  );
}

export default styled(React.memo(Contracts))`
  .content {
    > :not(:last-child) {
      margin-bottom: 0.9rem;
    }
  }
`;
