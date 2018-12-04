// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the APL2 license. See the LICENSE file for details.

import { Prefix } from '@polkadot/keyring/address/types';
import { BaseProps } from './types';

import './IdentityIcon.css';

import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
// FIXME Pulling in from ui-app is not preferrable, we would rather init when set
import settings from '@polkadot/ui-app/settings';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { isHex, isU8a } from '@polkadot/util';

import Empty from './Empty';
import Polkadot from './Polkadot';
import Substrate from './Substrate';

type Props = BaseProps & {
  isHighlight?: boolean,
  prefix?: Prefix,
  size?: number,
  theme?: string,
  value?: string | Uint8Array | null
};

type State = {
  address?: string | null
};

const DEFAULT_SIZE = 64;
const Components: { [index: string]: React.ComponentType<any> } = {
  'polkadot': Polkadot,
  'substrate': Substrate
};

export default class IdentityIcon extends React.PureComponent<Props, State> {
  state: State = {
    address: null
  };

  private static prefix?: Prefix = undefined;

  static setDefaultPrefix (prefix: Prefix) {
    IdentityIcon.prefix = prefix;
  }

  static getDerivedStateFromProps ({ prefix = IdentityIcon.prefix, value }: Props, prevState: State): State | null {
    try {
      const address = isU8a(value) || isHex(value)
        ? encodeAddress(value, prefix)
        : value;

      decodeAddress(address as string, prefix);

      return address === prevState.address
        ? null
        : { address };
    } catch (error) {
      // swallow,invalid address or input
    }

    return {
      address: null
    };
  }

  render () {
    const { className, isHighlight = false, size = DEFAULT_SIZE, style, theme = settings.uiTheme } = this.props;
    const { address } = this.state;

    const Component = !address
      ? Empty
      : Components[theme] || Substrate;

    return (
      <CopyToClipboard text={address || ''}>
        <div
          className={['ui--IdentityIcon', isHighlight ? 'highlight' : '', className].join(' ')}
          key={address || ''}
          style={style}
        >
          <Component
            size={size}
            value={address || ''}
          />
        </div>
      </CopyToClipboard>
    );
  }
}
