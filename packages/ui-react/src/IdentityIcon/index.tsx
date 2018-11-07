// Copyright 2017-2018 @polkadot/ui-react authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BaseProps } from '../types';

import './IdentityIcon.css';

import React from 'react';
import settings from '@polkadot/ui-app/settings';

import Polkadot from './Polkadot';
import Substrate from './Substrate';

type Props = BaseProps & {
  isHighlight?: boolean,
  size?: number,
  value?: string | Uint8Array | null
};

const DEFAULT_SIZE = 64;
const Component = settings.uiTheme === 'substrate'
  ? Substrate
  : Polkadot;

export default class IdentityIcon extends React.PureComponent<Props> {
  render () {
    const { className, isHighlight = false, size = DEFAULT_SIZE, style, value } = this.props;

    if (!value) {
      return null;
    }

    return (
      <div
        className={['ui--IdentityIcon', isHighlight ? 'highlight' : '', className].join(' ')}
        key={value.toString()}
        style={style}
      >
        <Component
          size={size}
          value={value}
        />
      </div>
    );
  }
}
