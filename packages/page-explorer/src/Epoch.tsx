// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { AddressMini } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';
import { FormatBalance } from '@polkadot/react-query';
import { useApi } from '@polkadot/react-hooks';

interface Props {
  value: object,
}

function Epoch ({ value }: Props): React.ReactElement<Props> | null {
  if (!value) {
    return null;
  }

  const [stats, setStats] = useState();
  const { api } = useApi();

  async function loadStats() {
    const epochStats = await api.query.poAModule.epochs(value.index);
    setStats(epochStats);
  }

  useEffect(() => {
    if (!stats) {
      loadStats();
    }
  }, []);

  return (
    <tr>
      <td className='number'>
        <h2><Link to={`/explorer/epochs/${value.index}`}>#{formatNumber(value.index)}</Link></h2>
      </td>
      {stats && (
        <>
          <td className='number'>
            <p>{`${stats.validator_count}`}</p>
          </td>
          <td className='number'>
            <p>{`${stats.starting_slot.toHuman()}`}</p>
          </td>
          <td className='number'>
            <p>{`${stats.expected_ending_slot.toHuman()}`}</p>
          </td>
          <td className='number'>
            <p>{`${stats.ending_slot.isSome ? stats.ending_slot.unwrap().toHuman() : '-'}`}</p>
          </td>
          <td className='number'>
            <FormatBalance value={stats.emission_for_treasury.isSome ? stats.emission_for_treasury.unwrap() + stats.emission_for_validators.unwrap() : 0} />
          </td>
          <td className='number'>
            <FormatBalance value={stats.emission_for_treasury.isSome ? stats.emission_for_treasury.unwrap() : 0} />
          </td>
          <td className='number'>
            <FormatBalance value={stats.emission_for_validators.isSome ? stats.emission_for_validators.unwrap() : 0} />
          </td>
        </>
      )}
    </tr>
  );
}

export default React.memo(Epoch);
