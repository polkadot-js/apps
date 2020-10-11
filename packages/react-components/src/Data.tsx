// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyJson, Codec, TypeDef, TypeDefInfo } from '@polkadot/types/types';
import { BareProps } from './types';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { isUndefined, isNull } from '@polkadot/util';
import { formatData } from '@canvas-ui/api-contract/util';
import { useApi, useCodec } from '@canvas-ui/react-hooks';
import { truncate } from '@canvas-ui/react-util';
import { Option } from '@polkadot/types';

import AddressSmall from './AddressMini';
import Labelled from './Labelled';

interface Props extends BareProps {
  isTrimmed?: boolean;
  type?: TypeDef;
  value?: AnyJson;
}

const TRUNCATE_TO = 16;

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

// function isCodec (value: Codec | AnyJson): value is Codec {
  
// }

function Data ({ className, type, value }: Props): React.ReactElement<Props> | null {
  const [codec] = useCodec(value, type);

  const content = useMemo(
    (): React.ReactNode => {
      if (!codec) {
        return '()';
      }

      if (!type || type.displayName === 'Hash') {
        return truncate(codec.toHex(), TRUNCATE_TO);
      }

      if (type.type === 'AccountId') {
        return (
          <AddressSmall
            className='account-id'
            value={codec}
          />
        );
      }

      if (type.info === TypeDefInfo.Option && codec instanceof Option) {
        const isSome = codec.isSome;

        return (
          <div className='enum'>
            {isSome ? 'Some' : 'None'}
            {isSome && (
              <>
                {'('}
                <div className='inner'>
                  <Data
                    type={type.sub as TypeDef}
                    value={codec.toString()}
                  />
                </div>
                {')'}
              </>
            )}
          </div>
        );
      }

      if (type.info === TypeDefInfo.Plain) {
        return truncate(codec.toString(), TRUNCATE_TO);
      }

      if (type.info === TypeDefInfo.Struct) {
        const struct = codec.toJSON() as Record<string, AnyJson>;

        return (
          <Labelled
            isIndented
            isSmall
            withLabel={false}
          >
            {
              Object.entries(struct).map(([key, field], index) => {
                return (
                  <Field
                    key={key}
                    name={key}
                    value={
                      <Data
                        type={(type.sub as TypeDef[])[index]}
                        value={field}
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
    [codec, type]
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
