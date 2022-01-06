// Copyright 2017-2022 @polkadot/app-storage authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueryableStorageEntry } from '@polkadot/api/types';
import type { ComponentRenderer, DefaultProps, RenderFn } from '@polkadot/react-api/hoc/types';
import type { ConstValue } from '@polkadot/react-components/InputConsts/types';
import type { Option, Raw } from '@polkadot/types';
import type { Registry } from '@polkadot/types/types';
import type { QueryTypes, StorageModuleQuery } from './types';

import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { withCallDiv } from '@polkadot/react-api/hoc';
import { Button, Labelled } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import valueToText from '@polkadot/react-params/valueToText';
import { getSiName } from '@polkadot/types/metadata/util';
import { unwrapStorageType } from '@polkadot/types/primitive/StorageKey';
import { compactStripLength, isU8a, u8aToHex, u8aToString } from '@polkadot/util';

interface Props {
  className?: string;
  onRemove: (id: number) => void;
  value: QueryTypes;
}

interface CacheInstance {
  Component: React.ComponentType<any>;
  render: RenderFn;
  refresh: (swallowErrors: boolean, contentShorten: boolean) => React.ComponentType<any>;
}

const cache: CacheInstance[] = [];

function keyToName (isConst: boolean, _key: Uint8Array | QueryableStorageEntry<'promise'> | ConstValue): string {
  if (isConst) {
    const key = _key as ConstValue;

    return `const ${key.section}.${key.method}`;
  }

  const key = _key as Uint8Array | QueryableStorageEntry<'promise'>;

  if (isU8a(key)) {
    const [, u8a] = compactStripLength(key);

    // If the string starts with `:`, handle it as a pure string
    return u8a[0] === 0x3a
      ? u8aToString(u8a)
      : u8aToHex(u8a);
  }

  return `${key.creator.section}.${key.creator.method}`;
}

function constTypeToString (registry: Registry, { meta }: ConstValue): string {
  return getSiName(registry.lookup, meta.type);
}

function queryTypeToString (registry: Registry, { creator: { meta: { modifier, type } } }: QueryableStorageEntry<'promise'>): string {
  const _type = unwrapStorageType(registry, type);

  return modifier.isOptional
    ? `Option<${_type}>`
    : _type;
}

function createComponent (type: string, Component: React.ComponentType<any>, defaultProps: DefaultProps, renderHelper: ComponentRenderer): { Component: React.ComponentType<any>; render: (createComponent: RenderFn) => React.ComponentType<any>; refresh: (swallowErrors: boolean, contentShorten: boolean) => React.ComponentType<any> } {
  return {
    Component,
    // In order to modify the parameters which are used to render the default component, we can use this method
    refresh: (contentShorten: boolean): React.ComponentType<any> =>
      renderHelper(
        (value: unknown) => <pre>{valueToText(type, value as null, contentShorten)}</pre>,
        defaultProps
      ),
    // In order to replace the default component during runtime we can provide a RenderFn to create a new 'plugged' component
    render: (createComponent: RenderFn): React.ComponentType<any> =>
      renderHelper(createComponent, defaultProps)
  };
}

function getCachedComponent (registry: Registry, query: QueryTypes): CacheInstance {
  const { blockHash, id, isConst, key, params = [] } = query as StorageModuleQuery;

  if (!cache[id]) {
    let renderHelper;
    let type: string;

    if (isConst) {
      const { method, section } = key as unknown as ConstValue;

      renderHelper = withCallDiv(`consts.${section}.${method}`, { withIndicator: true });
      type = constTypeToString(registry, key as unknown as ConstValue);
    } else {
      if (isU8a(key)) {
        // subscribe to the raw key here
        renderHelper = withCallDiv('rpc.state.subscribeStorage', {
          paramName: 'params',
          paramValid: true,
          params: [[key]],
          transform: ([data]: Option<Raw>[]): Option<Raw> => data,
          withIndicator: true
        });
      } else {
        const values: unknown[] = params.map(({ value }) => value);
        const { creator: { meta: { type } } } = key;
        const allCount = type.isPlain
          ? 0
          : type.asMap.hashers.length;
        const isEntries = values.length !== allCount;

        renderHelper = withCallDiv('subscribe', {
          paramName: 'params',
          paramValid: true,
          params: isEntries
            ? [key.entries, ...values]
            : blockHash
              ? [key.at, blockHash, ...values]
              : [key, ...values],
          withIndicator: true
        });
      }

      type = key.creator && key.creator.meta
        ? queryTypeToString(registry, key)
        : 'Raw';
    }

    const defaultProps = { className: 'ui--output' };
    const Component = renderHelper(
      // By default we render a simple div node component with the query results in it
      (value: unknown) => <pre>{valueToText(type, value as null, true)}</pre>,
      defaultProps
    );

    cache[query.id] = createComponent(type, Component, defaultProps, renderHelper);
  }

  return cache[id];
}

function Query ({ className = '', onRemove, value }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const [{ Component }, callName, callType] = useMemo(
    () => [
      getCachedComponent(api.registry, value),
      keyToName(value.isConst, value.key),
      value.isConst
        ? constTypeToString(api.registry, value.key as unknown as ConstValue)
        : isU8a(value.key)
          ? 'Raw'
          : queryTypeToString(api.registry, value.key as QueryableStorageEntry<'promise'>)
    ],
    [api, value]
  );

  const _onRemove = useCallback(
    (): void => {
      delete cache[value.id];

      onRemove(value.id);
    },
    [onRemove, value]
  );

  if (!Component) {
    return null;
  }

  return (
    <div className={`storage--Query storage--actionrow ${className}`}>
      <div className='storage--actionrow-value'>
        <Labelled
          label={
            <div className='storage--actionrow-label'>
              {callName}: {callType}
            </div>
          }
        >
          <Component />
        </Labelled>
      </div>
      <div className='storage--actionrow-buttons'>
        <Button
          icon='times'
          key='close'
          onClick={_onRemove}
        />
      </div>
    </div>
  );
}

export default React.memo(styled(Query)`
  margin-bottom: 0.25em;

  label {
    text-transform: none !important;
  }

  .ui.disabled.dropdown.selection {
    color: #aaa;
    opacity: 1;
  }

  .ui--IdentityIcon {
    margin: -10px 0;
    vertical-align: middle;
  }

  pre {
    margin: 0;

    .ui--Param-text {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .storage--actionrow-buttons {
    margin-top: -0.25rem; /* offset parent spacing for buttons */
  }
`);
