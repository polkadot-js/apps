// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';

import './Queries.css';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import Div from '@polkadot/rx-react/Div';
import withStorage from '@polkadot/rx-react/with/storage';

import format from './format';

type Props = I18nProps & {};

export default function Query ({ className, query: { key }, subject, style }: Props): React$Node {
  const Value = withStorage(key)(Div);

  return (
    <div>
      <Label>
        {JSON.stringify(key)}
      </Label>
      <Value
        className='ui disabled dropdown selection'
        classNameUpdated='hasUpdated'
        format={format}
      />
    </div>
  );
}
