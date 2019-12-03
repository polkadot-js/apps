// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Table } from '@polkadot/react-components';

import Motion from './Motion';
import Propose from './Propose';
import translate from '../translate';

interface Props extends I18nProps {
  motions?: Hash[];
}

function Proposals ({ className, motions, t }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <Propose />
      {motions?.length
        ? (
          <Table>
            <Table.Body>
              {motions?.map((hash: Hash): React.ReactNode => (
                <Motion
                  hash={hash.toHex()}
                  key={hash.toHex()}
                />
              ))}
            </Table.Body>
          </Table>
        )
        : t('No council motions')
      }
    </div>
  );
}

export default translate(Proposals);
