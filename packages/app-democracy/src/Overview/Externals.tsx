// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, BlockNumber, Hash, Proposal, VoteThreshold } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';
import { I18nProps as Props } from '@polkadot/react-components/types';

import React, { useEffect, useState } from 'react';
import { AddressSmall, Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { Bytes, Option } from '@polkadot/types';

import translate from '../translate';
import ProposalCell from './ProposalCell';

function Externals ({ className, t }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const external = useCall<Option<ITuple<[Hash, VoteThreshold]>>>(api.query.democracy.nextExternal, []);
  const [hash, setHash] = useState<Hash | null>(null);
  const [expanded, setExpanded] = useState<{ at: BlockNumber; balance: Balance; proposer: AccountId; proposal: Proposal } | null>(null);
  const preimage = useCall<Option<ITuple<[Bytes, AccountId, Balance, BlockNumber]>>>(api.query.democracy.preimages, [hash]);

  useEffect((): void => {
    setHash(
      external?.isSome
        ? external.unwrap()[0]
        : null
    );
  }, [external]);

  useEffect((): void => {
    if (preimage?.isSome) {
      const preImage = preimage.unwrap();

      setExpanded({
        at: preImage[3],
        balance: preImage[2],
        proposer: preImage[1],
        proposal: api.createType('Proposal', preImage[0].toU8a(true))
      });
    } else {
      setExpanded(null);
    }
  }, [preimage]);

  if (!hash) {
    return null;
  }

  return (
    <div className={`proposalSection ${className}`}>
      <h1>{t('externals')}</h1>
      <Table>
        <Table.Body>
          <tr className={className}>
            <td className='top'>
              {expanded && <AddressSmall value={expanded.proposer} />}
            </td>
            <td className='number together top'>
              {expanded && <FormatBalance label={<label>{t('locked')}</label>} value={expanded.balance} />}
            </td>
            <ProposalCell
              className='top'
              proposalHash={hash}
              proposal={expanded?.proposal}
            />
          </tr>
        </Table.Body>
      </Table>
    </div>
  );
}

export default translate(Externals);
