// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '../augment-supersig.ts';
//import type { MembersList, FetchProposalState, UserSupersig } from 'supersig-types/dist/interfaces/'
import type { AccountBalance, SupersigsAssociated } from '../typesAccount';
// import { ApiPromise } from '@polkadot/api';
// import definitions from 'supersig-types/dist/interfaces/';


import React from 'react';

import { useTranslation } from '@polkadot/app-treasury/translate';
import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { useCall, useApi } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  balance?: AccountBalance;
  supersigs?: SupersigsAssociated;
}

function Summary ({ balance, supersigs, className }: Props) {
  const { api } = useApi();
  const { t } = useTranslation();
  const supersig = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
  const getUserSupersigs = api.rpc.superSig.getUserSupersigs(supersig)
  // const activeSupersigMember = useCall<UserSupersig>(api.rpc.superSig.getUserSupersigs(supersig))>;
  //api.rpc.superSig.listMembers(supersigs)




  // const activeProposals = useCall<unknown[]>(api.derive.democracy.proposals);



  return (

    <SummaryBox className={className}>
      {balance && (
        <>
        {/* {supersigs.total.gtn(0) &&
            <CardSummary label={t<string>('total balance')}>
              <FormatBalance value={supersigs.total} />
            </CardSummary>} */}
           {balance.total.gtn(0) &&
            <CardSummary label={t<string>('total balance')}>
              <FormatBalance value={balance.total} />
            </CardSummary>}
          {/*{balance.transferrable.gtn(0) &&
            <CardSummary label={t<string>('total transferrable')}>
              <FormatBalance value={balance.transferrable} />
            </CardSummary>}
          {balance.locked.gtn(0) &&
            <CardSummary label={t<string>('total locked')}>
              <FormatBalance value={balance.locked} />
            </CardSummary>}
          {balance.bonded.gtn(0) &&
            <CardSummary label={t<string>('bonded')}>
              <FormatBalance value={balance.bonded} />
            </CardSummary>}
          {balance.redeemable.gtn(0) &&
            <CardSummary label={t<string>('redeemable')}>
              <FormatBalance value={balance.redeemable} />
            </CardSummary>}
          {balance.unbonding.gtn(0) &&
            <CardSummary label={t<string>('unbonding')}>
              <FormatBalance value={balance.unbonding} />
            </CardSummary>} */}
        </>)}
    </SummaryBox>
  );
}

export default React.memo(Summary);
