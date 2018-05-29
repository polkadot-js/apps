// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringOptions, KeyringOption$Type } from '@polkadot/ui-keyring/types';
import type { ApiProps } from '@polkadot/ui-react-rx/types';
import type { BareProps } from '../types';

import './InputAddress.css';

import React from 'react';

import keyring from '@polkadot/ui-keyring';
import createOptionHeader from '@polkadot/ui-keyring/options/header';
import addressDecode from '@polkadot/util-keyring/address/decode';
import withApi from '@polkadot/ui-react-rx/with/api';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import addressToAddress from './addressToAddress';

type Props = BareProps & ApiProps & {
  defaultValue?: string | Uint8Array,
  hideAddress?: boolean;
  isError?: boolean,
  isInput?: boolean,
  label?: string,
  onChange: (value: Uint8Array) => void,
  type?: KeyringOption$Type,
  value?: string | Uint8Array,
  withLabel?: boolean
};

type State = {
  apiChain?: string,
  defaultValue: ?string,
  options: KeyringOptions,
  subscriptions: Array<rxjs$ISubscription | null>,
  value?: string
}

const RECENT_KEY = 'header-recent';

const transform = (value: string): Uint8Array => {
  try {
    return addressDecode(value);
  } catch (error) {
    return new Uint8Array([]);
  }
};

// NOTE: We are not extending Component here since the options may change in the keyring (which needs a re-render), however the input props will be the same (so, no PureComponent with shallow compare here)
class InputAddress extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = ({
      defaultValue: addressToAddress(props.defaultValue),
      subscriptions: []
    }: $Shape<State>);
  }

  static getDerivedStateFromProps ({ value }: Props): $Shape<State> | null {
    try {
      return {
        value: addressToAddress(value) || undefined
      };
    } catch (error) {
      return null;
    }
  }

  componentDidMount () {
    const { api } = this.props;

    this.setState({
      subscriptions:
        [
          () => api.system.chain().subscribe((apiChain?: string) => {
            this.setState({ apiChain });
          })
        ].map((fn: () => rxjs$ISubscription): rxjs$ISubscription | null => {
          try {
            return fn();
          } catch (error) {
            console.error(error);
            return null;
          }
        })
    });
  }

  componentWillUnmount (): void {
    const { subscriptions } = this.state;

    subscriptions.forEach((subscription) => {
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  render (): React$Node {
    const { className, hideAddress = false, isError, label, onChange, style, withLabel } = this.props;
    const { defaultValue, value } = this.state;
    const options = this.getOptions();

    return (
      <Dropdown
        className={classes('ui--InputAddress', hideAddress ? 'flag--hideAddress' : '', className)}
        defaultValue={
          value !== undefined
            ? undefined
            : defaultValue
        }
        isError={isError}
        label={label}
        onChange={onChange}
        onSearch={this.onSearch}
        options={options}
        style={style}
        transform={transform}
        value={value}
        withLabel={withLabel}
      />
    );
  }

  getOptions (): KeyringOptions {
    const { type = 'all' } = this.props;
    const { apiChain } = this.state;

    return keyring
      .getOptions(type)
      .filter(({ key, value }) => {
        if (apiChain === 'dev') {
          return true;
        } else if (value === null) {
          return key !== 'header-testing';
        }

        let meta = { isTesting: false };

        try {
          const pair = keyring.getPair(value);

          meta = pair.getMeta() || meta;
        } catch (error) {
        }

        return meta.isTesting !== true;
      });
  }

  onSearch = (filteredOptions: KeyringOptions, query: string): KeyringOptions => {
    const { isInput = true } = this.props;
    const queryLower = query.toLowerCase();
    const matches = filteredOptions.filter((item) => {
      if (item.value === null) {
        return true;
      }

      const { name, value } = item;
      const hasMatch = name.toLowerCase().indexOf(queryLower) !== -1 ||
      value.toLowerCase().indexOf(queryLower) !== -1;

      return hasMatch;
    });

    const valueMatches = matches.filter((item) => item.value !== null);

    if (isInput && valueMatches.length === 0) {
      const publicKey = transform(query);

      if (publicKey.length === 32) {
        if (!matches.find((item) => item.key === RECENT_KEY)) {
          matches.push(
            createOptionHeader('Recent')
          );
        }

        matches.push(
          keyring.saveRecent(query)
        );
      }
    }

    return matches.filter((item, index) => {
      const isLast = index === matches.length - 1;
      const nextItem = matches[index + 1];
      const hasNext = nextItem && nextItem.value;

      if (item.value !== null || (!isLast && hasNext)) {
        return true;
      }

      return false;
    });
  };
}

export default withApi(InputAddress);

// export default withApi(
//   rpcs.system.public.chain,
//   {
//     onChange: () => {},
//     propName: 'apiChain'
//   }
// )(InputAddress);

// export default InputAddress;
