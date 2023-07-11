// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { AddressSmall, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';

type Props = {
  committeeAddresses: string[] | undefined;
};

const AlephBFTCommitteeList = ({ committeeAddresses }: Props) => {
  const { t } = useTranslation();

  const header: [string][] = [
    [t('Finality committee')]
  ];

  const messageOnEmpty = committeeAddresses && t("Data isn't available.");

  return (
    <Table
      empty={messageOnEmpty}
      header={header}
    >
      {committeeAddresses?.map((address) => (
        <tr key={address}>
          <td><AddressSmall value={address} /></td>
        </tr>
      ))}
    </Table>
  );
};

export default AlephBFTCommitteeList;
