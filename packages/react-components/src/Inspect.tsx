// Copyright 2017-2022 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Inspect } from '@polkadot/types/types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Output } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { u8aToHex } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  hex?: string | null;
  inspect?: Inspect | null;
  label: React.ReactNode;
}

interface Inspected {
  name: string;
  value: string;
}

function formatInspect ({ inner = [], name = '', outer = [] }: Inspect, result: Inspected[] = []): Inspected[] {
  if (outer.length) {
    const value = new Array<string>(outer.length);

    for (let i = 0; i < outer.length; i++) {
      value[i] = u8aToHex(outer[i], undefined, false);
    }

    result.push({ name, value: value.join(' ') });
  }

  for (let i = 0; i < inner.length; i++) {
    formatInspect(inner[i], result);
  }

  return result;
}

function DecodedInspect ({ className, hex, inspect, label }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { createLink } = useApi();
  const formatted = useMemo(
    () => inspect && formatInspect(inspect),
    [inspect]
  );
  const [link, path] = useMemo(
    (): [null | string, null | string] => {
      if (hex) {
        const path = `/extrinsics/decode/${hex}`;

        return [createLink(path), `#${path}`];
      }

      return [null, null];
    },
    [createLink, hex]
  );

  if (!formatted) {
    return null;
  }

  return (
    <Output
      className={className}
      isDisabled
      label={label}
    >
      <table>
        <tbody>
          {formatted.map(({ name, value }, i) => (
            <tr key={i}>
              <td>{name}</td>
              <td>{value}</td>
            </tr>
          ))}
          {link && (
            <tr
              className='isLink'
              key='hex'
            >
              <td>{t<string>('link')}</td>
              <td>
                <a
                  href={link}
                  rel='noreferrer'
                  target='_blank'
                >{path}</a>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Output>
  );
}

export default React.memo(styled(DecodedInspect)`
  table {
    width: 100%;

    tbody {
      width: 100%;

      tr {
        width: 100%;

        td {
          vertical-align: top;
        }

        td:first-child {
          color: var(--color-label);
          padding: 0 0.5em 0 1rem;
          text-align: right;
          white-space: nowrap;
        }

        &:not(.isLink) td:last-child {
          font: var(--font-mono);
          width: 100%;
        }

        &.isLink td {
          &:last-child {
            max-width: 0;
          }

          a {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
`);
