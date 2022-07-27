// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Unscrupelous as UnscrupelousType } from '../types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Account from './Account';
import Website from './Website';

interface Props {
  className?: string;
  unscrupelous?: UnscrupelousType;
}

function Unscrupelous ({ className, unscrupelous }: Props): React.ReactElement<Props> {
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
        empty={unscrupelous && unscrupelous.accounts && t<string>('No accounts')}
        header={accRef.current}
      >
        {unscrupelous && unscrupelous.accounts.map((m) => (
          <Account
            key={m}
            value={m}
          />
        ))}
      </Table>
      <Table
        empty={unscrupelous && unscrupelous.websites && t<string>('No websites')}
        header={webRef.current}
      >
        {unscrupelous && unscrupelous.websites.map((m) => (
          <Website
            key={m}
            value={m}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Unscrupelous);
