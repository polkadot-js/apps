import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '@polkadot/react-hooks';
import Epoch from '../Epoch';
import { useTranslation } from '../translate';

import { HeaderExtended } from '@polkadot/api-derive';
import { Table } from '@polkadot/react-components';

import { getSub, getQuery, accountToPolkadot } from '../apollo-helpers';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';

const epochsPerPage = 16;

const VALIDATORS_QUERY = gql`
  query validator {
    validator(
      order_by: { rank: asc }
    ) {
      account_id
      stash_id
      commission
      next_elected
      exposure_others
      exposure_own
      exposure_total
      produced_blocks
      rank
    }
  }
`;

// Take entries of map with numeric keys and sort them in ascending order of key
function sortEntriesOfMapWithNumKey(entries) {
  entries.sort((element1, element2) => element1[0]._args[0].toNumber() - element2[0]._args[0].toNumber());
}

function EpochsList (): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const [ totalRewards, setTotalRewards ] = useState({});
  const [ accounts, setAccounts ] = useState([]);
  const headers = [
    [t('validators'), 'start', 5],
    [t('produced blocks'), 'expand'],
  ];


// async function loadStats() {
//   console.log('Epochs');
//   console.log('');
//   const epochs = await api.query.poAModule.epochs.entries();
//   sortEntriesOfMapWithNumKey(epochs);
//   epochs.forEach((element) => {
//     console.log(element[0]._args[0].toNumber());
//     const epochNo = element[0].toHuman();
//     console.log(`epoch no ${epochNo}`);
//     const lastSlot = element[1].ending_slot.isSome ? element[1].ending_slot.unwrap().toHuman() : 'Nil';
//     console.log(`No of validators: ${element[1].validator_count}, starting slot: ${element[1].starting_slot.toHuman()}, expected ending slot: ${element[1].expected_ending_slot.toHuman()}, ending slot ${lastSlot}`);
//     if (element[1].total_emission.isSome) {
//       const totalEmission = element[1].total_emission.unwrap().toHuman();
//       const treasEmission = element[1].emission_for_treasury.unwrap().toHuman();
//       const valdEmission = element[1].emission_for_validators.unwrap().toHuman();
//       console.log(`Total emission: ${totalEmission}, Emission for Treasury: ${treasEmission}, Emission for validators: ${valdEmission}`);
//     }
//     console.log('');
//   });
//   console.log('------------------------------------------------------------------------------------------------------------');
//   console.log('');
// }

  async function printEpochStats() {
    const currentEpoch = await api.query.poAModule.epoch();
    console.log(`currentEpoch ${currentEpoch}`);

    const promises = [];
    for (let i = currentEpoch; i >= Math.max(currentEpoch - epochsPerPage, 1); i--) {
      promises.push({
        index: i
      });
    }

    setAccounts(promises);
  }

  useEffect(() => {
    if (accounts.length === 0) {
      printEpochStats();
      // loadStats();
    }
  }, []);

  const headerRef = useRef([
    [t('epochs'), 'start'],
    [t('validator count')],
    [t('starting slot')],
    [t('expected ending slot')],
    [t('ending slot')],
    [t('total_emission')],
    [t('treasury rewards')],
    [t('validator rewards'), 'expand'],
    [],
  ]);

  // TODO: add pagination

  return (
    <Table
      empty={t<string>('No epochs available')}
      header={headerRef.current}
    >
      {accounts
        .filter((header) => !!header)
        .map((header): React.ReactNode => (
          <Epoch key={header.index} value={header} />
        ))}
    </Table>
  );
}

export default React.memo(EpochsList);
