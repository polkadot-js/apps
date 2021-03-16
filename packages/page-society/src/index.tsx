// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import Candidates from './Candidates';
import Overview from './Overview';
import { useTranslation } from './translate';
import useCounter from './useCounter';
import useMembers from './useMembers';

interface Props {
  basePath: string;
  className?: string;
}

export { useCounter };

function SocietyApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const candidateCount = useCounter();
  const { allMembers, isMember, ownMembers } = useMembers();

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Society overview')
    },
    {
      count: candidateCount,
      name: 'candidates',
      text: t<string>('Candidates')
    }
  ], [candidateCount, t]);

  return (
    <main className={className}>
      <header>
        <Tabs
          basePath={basePath}
          items={items}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/candidates`}>
          <Candidates
            allMembers={allMembers}
            isMember={isMember}
            ownMembers={ownMembers}
          />
        </Route>
        <Route>
          <Overview
            isMember={isMember}
            ownMembers={ownMembers}
          />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(SocietyApp);
