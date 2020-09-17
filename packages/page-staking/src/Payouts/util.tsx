// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import BN from 'bn.js';
import { formatNumber } from '@polkadot/util';

function isSingle (entry: BN | [BN, BN]): entry is BN {
  return !Array.isArray(entry);
}

export function createErasString (eras: BN[]): React.ReactNode {
  if (!eras.length) {
    return '';
  }

  const parts = eras
    .sort((a, b) => a.cmp(b))
    .reduce((result: (BN | [BN, BN])[], era): (BN | [BN, BN])[] => {
      if (result.length === 0) {
        return [era];
      } else {
        const last = result[result.length - 1];

        if (isSingle(last)) {
          if (last.addn(1).eq(era)) {
            result[result.length - 1] = [last, era];
          } else {
            result.push(era);
          }
        } else {
          if (last[1].addn(1).eq(era)) {
            last[1] = era;
          } else {
            result.push(era);
          }
        }
      }

      return result;
    }, [])
    .map((entry) =>
      isSingle(entry)
        ? formatNumber(entry)
        : `${formatNumber(entry[0])}-${formatNumber(entry[1])}`
    );

  return (
    <>
      {parts.map((section, index) => (
        <React.Fragment key={section}>
          {index !== 0 && ', '}
          <span>{section}</span>
        </React.Fragment>
      ))}
    </>
  );
}
