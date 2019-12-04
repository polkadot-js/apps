// Copyright 2017-2019 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { Hash } from '@polkadot/types/interfaces';
import { ComponentProps } from '../types';

import React from 'react';
import { Table } from '@polkadot/react-components';

import Proposal from './Proposal';
import translate from '../translate';

interface Props extends ComponentProps, I18nProps {}

function Proposals ({ className, proposals, t }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      {proposals?.length
        ? (
          <Table>
            <Table.Body>
              {proposals?.map((hash: Hash): React.ReactNode => (
                <Proposal
                  hash={hash.toHex()}
                  key={hash.toHex()}
                />
              ))}
            </Table.Body>
          </Table>
        )
        : t('No committee proposals')
      }
    </div>
  );
}

export default translate(Proposals);
