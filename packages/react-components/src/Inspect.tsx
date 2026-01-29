// Copyright 2017-2025 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Inspect } from '@polkadot/types/types';

import React, { useMemo } from 'react';

import { useApi } from '@polkadot/react-hooks';
import { u8aToHex } from '@polkadot/util';

import Output from './Output.js';
import { styled } from './styled.js';
import { useTranslation } from './translate.js';

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

  for (let i = 0, count = inner.length; i < count; i++) {
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
    <StyledOutput
      className={className}
      isDisabled
      label={label}
    >
      <table>
        <tbody>
          {formatted.map(({ name, value }, i) => (
            <tr key={i}>
              <td><label>{name}</label></td>
              <td>{value}</td>
            </tr>
          ))}
          {link && (
            <tr
              className='isLink'
              key='hex'
            >
              <td><label>{t('link')}</label></td>
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
    </StyledOutput>
  );
}

const StyledOutput = styled(Output)`
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
          text-align: right;
          vertical-align: middle;
          white-space: nowrap;

          label {
            padding: 0 0.5rem 0 1.25rem;
          }
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
`;

export default React.memo(DecodedInspect);
