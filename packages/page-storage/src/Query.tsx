// Copyright 2017-2020 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueryableStorageEntry } from '@polkadot/api/types';
import { RenderFn, DefaultProps, ComponentRenderer } from '@polkadot/react-api/hoc/types';
import { ConstValue } from '@polkadot/react-components/InputConsts/types';
import { QueryTypes, StorageModuleQuery } from './types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { unwrapStorageType } from '@polkadot/types/primitive/StorageKey';
import { Button, Labelled } from '@polkadot/react-components';
import { withCallDiv } from '@polkadot/react-api/hoc';
import valueToText from '@polkadot/react-params/valueToText';
import { Compact, Option, Raw } from '@polkadot/types';
import { isU8a, u8aToHex, u8aToString } from '@polkadot/util';

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
    const u8a = Compact.stripLengthPrefix(key);

    // If the string starts with `:`, handle it as a pure string
    return u8a[0] === 0x3a
      ? u8aToString(u8a)
      : u8aToHex(u8a);
  }

  return `${key.creator.section}.${key.creator.method}`;
}

function typeToString ({ creator: { meta: { modifier, type } } }: QueryableStorageEntry<'promise'>): string {
  const _type = unwrapStorageType(type);

  return modifier.isOptional
    ? `Option<${_type}>`
    : _type;
}

function createComponent (type: string, Component: React.ComponentType<any>, defaultProps: DefaultProps, renderHelper: ComponentRenderer): { Component: React.ComponentType<any>; render: (createComponent: RenderFn) => React.ComponentType<any>; refresh: (swallowErrors: boolean, contentShorten: boolean) => React.ComponentType<any> } {
  return {
    Component,
    // In order to modify the parameters which are used to render the default component, we can use this method
    refresh: (swallowErrors: boolean, contentShorten: boolean): React.ComponentType<any> =>
      renderHelper(
        (value: any) => <pre>{valueToText(type, value, swallowErrors, contentShorten)}</pre>,
        defaultProps
      ),
    // In order to replace the default component during runtime we can provide a RenderFn to create a new 'plugged' component
    render: (createComponent: RenderFn): React.ComponentType<any> =>
      renderHelper(createComponent, defaultProps)
  };
}

function getCachedComponent (query: QueryTypes): CacheInstance {
  const { id, isConst, key, params = [] } = query as StorageModuleQuery;

  if (!cache[id]) {
    let renderHelper;
    let type: string;

    if (isConst) {
      const { meta, method, section } = key as unknown as ConstValue;

      renderHelper = withCallDiv(`consts.${section}.${method}`, { withIndicator: true });
      type = meta.type.toString();
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
          : type.isMap
            ? 1
            : 2;

        if ((values.length === allCount) || (type.isMap && type.asMap.linked.isTrue)) {
          // render function to create an element for the query results which is plugged to the api
          renderHelper = withCallDiv('subscribe', {
            paramName: 'params',
            paramValid: true,
            params: [key, ...values],
            withIndicator: true
          });
        } else {
          renderHelper = withCallDiv('subscribe', {
            paramName: 'params',
            paramValid: true,
            params: [key.entries, ...values],
            withIndicator: true
          });
        }
      }

      type = key.creator && key.creator.meta
        ? typeToString(key)
        : 'Raw';
    }

    const defaultProps = { className: 'ui--output' };
    const Component = renderHelper(
      // By default we render a simple div node component with the query results in it
      (value: any) => <pre>{valueToText(type, value, true, true)}</pre>,
      defaultProps
    );

    cache[query.id] = createComponent(type, Component, defaultProps, renderHelper);
  }

  return cache[id];
}

function Query ({ className = '', onRemove, value }: Props): React.ReactElement<Props> | null {
  // const [inputs, setInputs] = useState<React.ReactNode[]>([]);
  const [{ Component }, setComponent] = useState<Partial<CacheInstance>>({});
  const [isSpreadable, setIsSpreadable] = useState(false);
  const [spread, setSpread] = useState<Record<number, boolean>>({});

  useEffect((): void => {
    setComponent(getCachedComponent(value));
    setIsSpreadable(
      (value.key as QueryableStorageEntry<'promise'>).creator &&
      (value.key as QueryableStorageEntry<'promise'>).creator.meta &&
      ['Bytes', 'Raw'].includes((value.key as QueryableStorageEntry<'promise'>).creator.meta.type.toString())
    );
  }, [value]);

  const _spreadHandler = useCallback(
    (id: number): () => void => {
      return (): void => {
        cache[id].Component = cache[id].refresh(true, !!spread[id]);
        spread[id] = !spread[id];

        setComponent(cache[id]);
        setSpread({ ...spread });
      };
    },
    [spread]
  );

  const _onRemove = useCallback(
    (): void => {
      delete cache[value.id];

      onRemove(value.id);
    },
    [onRemove, value]
  );

  const { id, isConst, key } = value;
  const type = isConst
    ? (key as unknown as ConstValue).meta.type.toString()
    : isU8a(key)
      ? 'Raw'
      : typeToString(key as QueryableStorageEntry<'promise'>);

  if (!Component) {
    return null;
  }

  return (
    <div className={`storage--Query storage--actionrow ${className}`}>
      <div className='storage--actionrow-value'>
        <Labelled
          label={
            <div className='storage--actionrow-label'>
              {keyToName(isConst, key)}: {type}
            </div>
          }
        >
          <Component />
        </Labelled>
      </div>
      <div className='storage--actionrow-buttons'>
        {isSpreadable && (
          <Button
            icon='ellipsis-h'
            key='spread'
            onClick={_spreadHandler(id)}
          />
        )}
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
