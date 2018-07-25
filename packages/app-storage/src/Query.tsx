// Copyright 2017-2018 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Storage$Key$Value } from '@polkadot/storage/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { StorageQuery } from './types';

import React from 'react';

import typeToString from '@polkadot/params/typeToString';
import Button from '@polkadot/ui-app/Button';
import Labelled from '@polkadot/ui-app/Labelled';
import valueToText from '@polkadot/ui-app/Params/valueToText';
import classes from '@polkadot/ui-app/util/classes';
import withStorageDiv from '@polkadot/ui-react-rx/with/storageDiv';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import addressEncode from '@polkadot/util-keyring/address/encode';

import translate from './translate';

type Props = I18nProps & {
  onRemove: (id: number) => void,
  value: StorageQuery
};

type ComponentProps = {};

type State = {
  inputs: Array<any>, // node?
  Component: React.ComponentType<ComponentProps>;
};

const cache: Array<React.ComponentType<ComponentProps>> = [];

class Query extends React.PureComponent<Props, State> {
  state: State = {} as State;

  static getCachedComponent ({ id, key, params }: StorageQuery): React.ComponentType<ComponentProps> {
    if (!cache[id]) {
      const values: Array<Storage$Key$Value> = params.map(({ value }) =>
        // FIXME not 100% convinced, arrays could be an issue? (Plus, if we have to cast, something just _seems_ off)
        value as Storage$Key$Value
      );

      // FIXME - Move into ui-app/src/Params/valueToAccountList for reuse
      const renderAccounts = (addresses: Array<Uint8Array | string>) => {
        return (
          <table className='accounts'>
            <thead>
              <tr>
                <th>Identitycon</th>
                <th>Account ID</th>
              </tr>
            </thead>
            <tbody>
              {
                addresses && addresses.length ?
                  (
                    addresses
                      .map((address) => {
                        return addressEncode(address as Uint8Array);
                      })
                      .map((accountId) => (
                        <tr key={accountId}>
                          <td><IdentityIcon size={24} value={accountId} /></td>
                          <td>{accountId}</td>
                        </tr>
                      ))
                  )
                : null
              }
            </tbody>
          </table>
        );
      };

      if (key.type[0] === 'AccountId') {
        cache[id] = withStorageDiv(key, { params: values })(
          (value: any) =>
            renderAccounts(value),
          { className: 'ui--output', style: { lineHeight: '2em' } }
        );
      } else {
        cache[id] = withStorageDiv(key, { params: values })(
          (value: any) =>
            valueToText(key.type, value),
          { className: 'ui--output' }
        );
      }
    }

    return cache[id];
  }

  static getDerivedStateFromProps ({ value }: Props, prevState: State): State | null {
    const Component = Query.getCachedComponent(value);
    const { key, params } = value;
    const inputs = key.params.map(({ name, type }, index) => (
      <span key={`param_${name}_${index}`}>
        {name}={valueToText(type, params[index].value)}
      </span>
    ));

    return {
      Component,
      inputs
    };
  }

  render () {
    const { className, style, value: { key } } = this.props;
    const { Component, inputs } = this.state;

    return (
      <div
        className={classes('storage--Query', 'storage--actionrow', className)}
        style={style}
      >
        <Labelled
          className='storage--actionrow-value'
          label={
            <div>{key.section}.{key.name}({inputs}): {typeToString(key.type)}</div>
          }
        >
          <Component />
        </Labelled>
        <Labelled className='storage--actionrow-button'>
          <Button
            icon='close'
            isNegative
            onClick={this.onRemove}
          />
        </Labelled>
      </div>
    );
  }

  onRemove = (): void => {
    const { onRemove, value: { id } } = this.props;

    delete cache[id];

    onRemove(id);
  }
}

export default translate(Query);
