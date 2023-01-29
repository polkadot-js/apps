// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '../../augment-supersig.ts';
//import type { MembersList, FetchProposalState, UserSupersig } from 'supersig-types/dist/interfaces/'
import type { AccountBalance, SupersigsAssociated, SortedSupersig } from '../typesAccount';
// import { ApiPromise } from '@polkadot/api';
// import definitions from 'supersig-types/dist/interfaces/';


import React from 'react';

import { useTranslation } from '@polkadot/app-treasury/translate';
import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { useCall, useApi } from '@polkadot/react-hooks';

type SortedAddress = { address: string; isFavorite: boolean };

interface Props {
  // className?: string;
  // balance?: AccountBalance;
  // supersigs?: SupersigsAssociated;
  sigCnt: SortedAddress[] | undefined;
  totalProposals: number;
  totalBalance: string;
}

function Summary ({ sigCnt, totalProposals, totalBalance }: Props) {
  const { api } = useApi();
  const { t } = useTranslation();
  const supersig = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
  // const getUserSupersigs = api.rpc.superSig.getUserSupersigs(supersig)
  // const activeSupersigMember = useCall<...any[]>(api.rpc.superSig.getUserSupersigs())>;
  //api.rpc.superSig.listMembers(supersigs)



  // const activeProposals = useCall<unknown[]>(api.derive.democracy.proposals);



  return (

    <div style={{display: "flex"}}>
      {/* {balance && ( */}
        {/* <> */}
          {
            sigCnt &&
              <CardSummary label={t<string>('Supersigs')}>
                <p>{sigCnt.length}</p>
              </CardSummary>
          }
          <CardSummary label={t<string>('Proposals')}>
            <p>{totalProposals}</p>
          </CardSummary>
          <CardSummary label={t<string>('Total Funds')}>
            <FormatBalance
              className='result'
              value={totalBalance}
            />
          </CardSummary>
    </div>
  );
}

export default React.memo(Summary);
