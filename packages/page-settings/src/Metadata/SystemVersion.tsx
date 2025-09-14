// Copyright 2017-2025 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BareProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';

import { packageInfo } from '@polkadot/apps-config';
import { Input, Spinner, styled, Table } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

const appsVersion = `apps v${packageInfo.version.replace('-x', '')}`;

function SystemVersion ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, isApiReady, systemName, systemVersion } = useApi();

  const headerRef = useRef<[React.ReactNode?, string?, number?][]>([
    [t('system version'), 'start', 2]
  ]);

  if (!isApiReady) {
    return <Spinner />;
  }

  return (
    <StyledTable
      className={className}
      empty={t('No version information available')}
      header={headerRef.current}
    >
      <tr>
        <td>
          <Input
            className='full'
            isDisabled
            label={t('Node version')}
            value={systemName + ' v' + systemVersion}
          />
        </td>
      </tr>
      <tr>
        <td>
          <Input
            className='full'
            isDisabled
            label={t('API Version')}
            value={`${api.libraryInfo.replace('@polkadot/api ', '')}`}
          />
        </td>
      </tr>
      <tr>
        <td>
          <Input
            className='full'
            isDisabled
            label={t('Apps Version')}
            value={`${appsVersion.replace('apps ', '')}`}
          />
        </td>
      </tr>
    </StyledTable>
  );
}

const StyledTable = styled(Table)`
  td {
    padding: 0;
    text-align: left;

    .input.ui--Input input {
      border: none !important;
      background: transparent;
      padding: 0;
      margin-left: 0;
    }

    .ui--Labelled-content .ui.input > input {
      padding-left: 0 !important;
    }

    .ui--Labelled:not(.isSmall) {
      padding-left: 0;
    }

    .ui--Labelled > label, .ui--Labelled > .ui--Labelled-content {
      left: 0 !important;
      padding-left: 0;
    }
  }
`;

export default React.memo(SystemVersion);
