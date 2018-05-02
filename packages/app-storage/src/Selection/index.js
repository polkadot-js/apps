// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';

import './Selection.css';

import React from 'react';
import withObservable from '@polkadot/rx-react/with/observable';
import InputStorage from '@polkadot/ui-react-app/src/InputStorage';

import { subject } from '../subjects';
import Queue from './Queue';

type Props = I18nProps & {};

export default function Selection ({ className, style }: Props): React$Node {
  const Query = withObservable(subject)(Queue);

  return (
    <div
      className={['storage--Selection', className].join(' ')}
      style={style}
    >
      <div className='ui--form'>
        <div className='full'>
          <InputStorage subject={subject} />
        </div>
      </div>
      <div className='storage--Selection-ButtonRow'>
        <Query />
      </div>
    </div>
  );
}
