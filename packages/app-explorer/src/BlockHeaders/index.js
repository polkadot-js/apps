// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Header } from '@polkadot/primitives/header';
import type { BaseProps } from '../types';

import React from 'react';
import withApiCall from '@polkadot/rx-react/with/apiCall';

import translate from '../translate';
import BlockHeader from '../BlockHeader';
import { blockHeaders } from '../subjects';
import transform from './transform';

type Props = BaseProps & {
  value: Array<Header>
};

function BlockHeaders ({ className, style, value }: Props): React$Node {
  return (
    <div
      className={['explorer--BlockHeaders', className].join(' ')}
      style={style}
    >
      {
        (value || []).map((header) => (
          <BlockHeader
            value={header}
            key={header.number.toString()}
          />
        ))
      }
    </div>
  );
}

export default translate(
  withApiCall(
    {
      method: 'newHead',
      section: 'chain'
    },
    {
      subject: blockHeaders,
      transform
    }
  )(BlockHeaders)
);
