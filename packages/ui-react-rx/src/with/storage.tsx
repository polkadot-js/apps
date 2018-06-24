// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

// TODO: Lots of duplicated code between this and withObservable, surely there ois a better way of doing this?

import { Storage$Key, Storage$Key$Value } from '@polkadot/storage/types';
import { ApiProps, BareProps, ChangeProps, ParamProps, RxProps } from '../types';
import { HOC, StorageOptions, DefaultProps, Transform } from './types';

import React from 'react';
import { map } from 'rxjs/operators/map';

import storageKey from '@polkadot/storage/key';

import intervalSubscribe from '../util/intervalSubscribe';
import isEqual from '../util/isEqual';
import triggerChange from '../util/triggerChange';
import echoTransform from './transform/echo';
import createTransform from './transform/storage';
import withApi from './api';

type InProps<T> = BareProps & ChangeProps<T> & ParamProps & {
  transform?: Transform
};

type InApiProps<T> = ApiProps & InProps<T>;

type OutProps<T> = InApiProps<T> & RxProps<T>;

type State<T> = RxProps<T> & {
  subscriptions: Array<any>; // FIXME subscriptions
}

// FIXME proper types for attributes

export default function withStorage<T> (key: Storage$Key, { onChange, params, propName = 'value', transform }: StorageOptions<T> = {}): HOC<T> {
  const keyCreator = storageKey(key);
  const storageTransform = createTransform(key);
  const createKey = (propParams?: Array<Storage$Key$Value>): Uint8Array => {
    const values = [params, propParams].reduce((result, input = []) => {
      if (Array.isArray(input)) {
        return result.concat(input);
      }

      result.push(input);
      return result;
    }, ([] as any[]));

    return keyCreator.apply(null, values);
  };

  return (Inner: React.ComponentType<any>, defaultProps: DefaultProps<T> = {}): React.ComponentType<any> => {
    class WithStorage extends React.Component<any, State<T>> {
      state: State<T>;

      constructor (props: any) {
        super(props);

        this.state = {
          rxUpdated: false,
          rxUpdatedAt: 0,
          subscriptions: [],
          value: void 0
        };
      }

      componentDidUpdate (prevProps: any) {
        if (!isEqual(this.props.params, prevProps.params)) {
          this.triggerUpdate();
        }
      }

      componentDidMount () {
        const subscriptions = [
          this.props.api.chain
            .newHead()
            .subscribe((value: any) => {
              this.triggerUpdate();
            }),
          intervalSubscribe(this)
        ];

        this.setState({
          subscriptions
        });
      }

      componentWillUnmount () {
        this.state.subscriptions.forEach((subscription) => {
          subscription.unsubscribe();
        });
      }

      triggerUpdate = async (): Promise<void> => {
        const mapping = (value: Uint8Array, index: number): any => {
          const outer = this.props.transform || echoTransform;
          const inner = transform || echoTransform;

          return outer(
            inner(
              storageTransform(value, index),
              index
            ),
            index
          );
        };

        const key = createKey(this.props.params);
        let value;

        try {
          value = await this.props.api.state
            .getStorage(key)
            .pipe(map(mapping))
            .toPromise();
        } catch (error) {
          // swallow?
          // console.error(error);
        }

        if (isEqual(value, this.state.value)) {
          return;
        }

        triggerChange(value, onChange, this.props.onChange || defaultProps.onChange);

        this.setState({
          rxUpdated: true,
          rxUpdatedAt: Date.now(),
          value
        });
      }

      render () {
        const { rxUpdated, rxUpdatedAt, value } = this.state;
        const _props = {
          ...defaultProps,
          ...this.props,
          rxUpdated,
          rxUpdatedAt,
          [propName]: value
        };

        delete _props.onChange;

        return (
          <Inner {..._props} />
        );
      }
    }

    return withApi(WithStorage);
  };
}
