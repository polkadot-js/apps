// Copyright 2017-2021 @polkadot/react-components authors & contributors
// and @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { registry as baseRegistry } from '@canvas-ui/react-api';
import { truncate, extractValueFromObj } from '@canvas-ui/react-util';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { createTypeUnsafe, Option } from '@polkadot/types';
import { Null } from '@polkadot/types/primitive';
import { AnyJson, Codec, Registry, TypeDef, TypeDefInfo } from '@polkadot/types/types';
import { isInstanceOf } from '@polkadot/util';

import AddressSmall from './AddressMini';
import Labelled from './Labelled';
import { BareProps } from './types';

interface Props extends BareProps {
  asJson?: boolean;
  isTrimmed?: boolean;
  registry?: Registry;
  type?: TypeDef;
  value?: AnyJson | null;
  isError?: boolean;
}

const TRUNCATE_TO = 16;

function formatData (registry: Registry, data: AnyJson | null, type: TypeDef | undefined): Codec {
  try {
    return createTypeUnsafe(registry, type?.type || type?.displayName || 'Raw', [extractValueFromObj(data)]);
  } catch (error) {
    console.error(error);

    return new Null(registry);
  }
}

function Field ({ name, value }: { name: string, value: React.ReactNode }): React.ReactElement {
  return (
    <div className='field'>
      <div className='key'>
        {name}:
      </div>
      <div className='value'>
        {value}
      </div>
    </div>
  );
}

function Data ({ asJson = false, className, registry = baseRegistry, type, value, isError }: Props): React.ReactElement<Props> | null {
  const content = useMemo(
    (): React.ReactNode => {
      if (isError) return value;

      const codec = formatData(registry, value, type);

      if (isInstanceOf(codec, Null)) {
        return '()';
      }

      if (!type || type.displayName === 'Hash') {
        return truncate(codec.toHex(), TRUNCATE_TO);
      }

      if (type.type === 'AccountId') {
        return value
          ? (
            <AddressSmall
              className='account-id'
              value={value.toString()}
            />
          )
          : null;
      }

      if (type.info === TypeDefInfo.Option && codec instanceof Option) {
        const isSome = codec.isSome;
        const subType = type.sub as TypeDef;

        if (asJson) {
          return `${isSome ? 'Some' : 'None'}${isSome ? `(${(codec.unwrap() as Codec).toString()})` : ''}`;
        }

        return (
          <div className='enum'>
            {isSome ? 'Some' : 'None'}
            {isSome && (
              <>
                {'('}
                <div className='inner'>
                  <Data
                    registry={registry}
                    type={subType}
                    value={(codec.unwrap() as Codec).toString()}
                  />
                </div>
                {')'}
              </>
            )}
          </div>
        );
      }

      if (type.info === TypeDefInfo.Plain) {
        return truncate(value?.toString() || '()', TRUNCATE_TO);
      }

      if (type.info === TypeDefInfo.Enum) {
        const json = value as unknown as Record<string, AnyJson>;
        const [variant, subValue] = Object.entries(json)[0];
        const isNull = !!subValue && typeof subValue === 'object' && Object.entries(subValue)[0] === null;
        const subType = (type.sub as TypeDef[]).find(({ name }) => name === variant);

        if (asJson) {
          return `${variant}: ${JSON.stringify(formatData(registry, subValue, subType).toJSON()) || '()'}`;
        }

        return (
          <Labelled
            isIndented
            isSmall
            withLabel={false}
          >
            <Field
              key={variant}
              name={variant}
              value={
                isNull
                  ? Object.keys(subValue as Record<string, AnyJson>)[0]
                  : <Data
                    asJson
                    registry={registry}
                    type={subType}
                    value={subValue}
                    />
              }
            />
          </Labelled>
        );
      }

      if (type.info === TypeDefInfo.Struct) {
        const struct = value as Record<string, AnyJson>;

        if (asJson) {
          return JSON.stringify(struct);
        }

        return (
          <Labelled
            isIndented
            isSmall
            withLabel={false}
          >
            {
              Object.entries(struct).map(([key, field], index) => {
                const subType = (type.sub as TypeDef[])[index];

                return (
                  <Field
                    key={key}
                    name={key}
                    value={
                      <Data
                        asJson
                        registry={registry}
                        type={subType}
                        value={formatData(registry, field, subType).toJSON()}
                      />
                    }
                  />
                );
              })
            }
          </Labelled>
        );
      }

      if (type.sub && [TypeDefInfo.Vec, TypeDefInfo.VecFixed].includes(type.info)) {
        const sub = type.sub as TypeDef;

        if (sub.type === 'u8') {
          return truncate(codec.toHex(), TRUNCATE_TO);
        }

        const array = codec.toJSON() as AnyJson[];

        if (!Array.isArray(array)) {
          return null;
        }

        if (asJson) {
          return JSON.stringify(array);
        }

        return (
          <Labelled
            isIndented
            isSmall
            withLabel={false}
          >
            {
              array.map((element, index) => {
                return (
                  <Field
                    key={index}
                    name={`${index}`}
                    value={
                      <Data
                        asJson
                        registry={registry}
                        type={sub}
                        value={element}
                      />
                    }
                  />
                );
              })
            }
          </Labelled>
        );
      }

      return truncate(codec.toHex(), TRUNCATE_TO);
    },
    [asJson, isError, value, registry, type]
  );

  return (
    <div className={className}>
      {content || null}
    </div>
  );
}

export default React.memo(styled(Data)`
  display: inline-block;

  .account-id {
    minWidth: auto;
  }

  .field {
    min-height: 2rem;
    display: flex;
    align-items: center;  

    .key {
      font-weight: bold;
    }
    
    .value {
      margin-left: 0.5rem;
    }
  }

  .enum {
    .inner {
      margin: 1rem 0 1rem 2rem;
    }
  }
`);
