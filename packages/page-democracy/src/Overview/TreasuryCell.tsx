// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProposalIndex, TreasuryProposal } from '@polkadot/types/interfaces';
import { TypeDef } from '@polkadot/types/types';

import React, { useEffect, useState } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import Params from '@polkadot/react-params';
import { Compact, Option, getTypeDef } from '@polkadot/types';

interface Props {
  className?: string;
  value: Compact<ProposalIndex>;
}

interface Param {
  name: string;
  type: TypeDef;
}

interface Value {
  isValid: boolean;
  value: TreasuryProposal;
}

interface ParamState {
  params: Param[];
  values: Value[];
}

function TreasuryCell ({ className = '', value }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const [proposalId] = useState(value.unwrap());
  const proposal = useCall<TreasuryProposal | null>(api.query.treasury.proposals, [proposalId], {
    transform: (optProp: Option<TreasuryProposal>) => optProp.unwrapOr(null)
  });
  const [{ params, values }, setExtracted] = useState<ParamState>({ params: [], values: [] });

  useEffect((): void => {
    proposal && setExtracted({
      params: [{
        name: 'proposal',
        type: getTypeDef('TreasuryProposal')
      }],
      values: [{
        isValid: true,
        value: proposal
      }]
    });
  }, [proposal]);

  if (!proposal) {
    return null;
  }

  return (
    <div className={className}>
      <Params
        isDisabled
        params={params}
        values={values}
      />
    </div>
  );
}

export default React.memo(TreasuryCell);
