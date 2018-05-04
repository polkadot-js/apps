// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';

import React from 'react';

import Queries from './Queries';
import Selection from './Selection';
import translate from './translate';

type Props = I18nProps & {};

function App ({ className, style, t }: Props): React$Node {
  return (
    <div
      className={['storage--App', className].join(' ')}
      style={style}
    >
      <Selection />
      <Queries />
    </div>
  );
}

export default translate(App);
