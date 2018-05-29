// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: Lots of duplicated code between this and withObservable, surely there ois a better way of doing this?

import type { Storage$Key, Storage$Key$Values } from '@polkadot/storage/types';
import type { ApiProps, BareProps, ChangeProps, ParamProps, RxProps } from '../types';
import type { HOC, StorageOptions, DefaultProps, Transform } from './types';

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
  subscriptions: Array<rxjs$ISubscription>;
}

export default function withStorage<T, ComponentProps: $Shape<OutProps<T>>, InputProps: InProps<T>, InputApiProps: InApiProps<T>> (key: Storage$Key, { onChange, params, propName = 'value', transform }: StorageOptions<T> = {}): HOC<T> {
  const keyCreator = storageKey(key);
  const storageTransform = createTransform(key);
  const createKey = (propParams?: Storage$Key$Values): Uint8Array => {
    const values = [params, propParams].reduce((result, input = []) => {
      if (Array.isArray(input)) {
        return result.concat(input);
      }

      result.push(input);
      return result;
    }, []);

    return keyCreator.apply(null, values);
  };

  return (Component: React$ComponentType<ComponentProps>, defaultProps?: DefaultProps<T> = {}): Class<React.Component<InputProps>> => {
    class WithStorage extends React.Component<InputApiProps, State<T>> {
      state: State<T>;

      constructor (props: InputApiProps) {
        super(props);

        this.state = {
          rxUpdated: false,
          rxUpdatedAt: 0,
          subscriptions: [],
          value: void 0
        };
      }

      componentDidUpdate (prevProps: InputApiProps) {
        if (!isEqual(this.props.params, prevProps.params)) {
          this.triggerUpdate();
        }
      }

      componentDidMount () {
        const subscriptions: Array<rxjs$ISubscription> = [
          this.props.api.chain
            .newHead()
            .subscribe((value) => {
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
        // flowlint-next-line unclear-type:off
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
        // flowlint-next-line inexact-spread:off
        const _props = {
          ...defaultProps,
          ...this.props,
          rxUpdated,
          rxUpdatedAt,
          [propName]: value
        };

        delete _props.onChange;

        return (
          <Component {..._props} />
        );
      }
    }

    return withApi(WithStorage);
  };
}
