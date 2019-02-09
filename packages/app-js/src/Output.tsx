// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { Log } from './types';

import React from 'react';
import { format } from '@polkadot/util/logger';

type Props = BareProps & {
  children?: React.ReactNode,
  logs: Array<Log>
};

export default (props: Props) => {
  const renderEntry = ({ args, type }: Log, index: number) => (
    <div className={`js--Log ${type}`} key={index}>
      {args.map((arg) => format(arg)).join(' ')}
    </div>
  );

  return (
    <article className='container js--Output'>
      <div className='logs-wrapper'>
        <div className='logs-container'>
          <div className='logs-content'>
            {props.logs.map(renderEntry)}
          </div>
        </div>
      </div>

      {props.children}
    </article>
  );
};
