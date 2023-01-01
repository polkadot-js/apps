// Copyright 2017-2023 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Unscrupulous as UnscrupulousType } from '../types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Account from './Account';
import Website from './Website';

interface Props {
  className?: string;
  unscrupulous?: UnscrupulousType;
}

function Unscrupulous ({ className, unscrupulous }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const accRef = useRef([
    [t<string>('accounts'), 'start']
  ]);

  const webRef = useRef([
    [t<string>('websites'), 'start']
  ]);

  return (
    <div className={className}>
      <Table
        empty={unscrupulous && unscrupulous.accounts && t<string>('No accounts')}
        header={accRef.current}
      >
        {unscrupulous && unscrupulous.accounts.map((m) => (
          <Account
            key={m}
            value={m}
          />
        ))}
      </Table>
      <Table
        empty={unscrupulous && unscrupulous.websites && t<string>('No websites')}
        header={webRef.current}
      >
        {unscrupulous && unscrupulous.websites.map((m) => (
          <Website
            key={m}
            value={m}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Unscrupulous);
