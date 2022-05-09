// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import Summary from './Summary';
import {useTranslation} from '../translate';
import useAttributeKeys from '../useAttributeKeys';

import { u128 } from '@polkadot/types';
import { BN } from '@polkadot/util';
import { useParams } from 'react-router-dom';
import { Table } from '@polkadot/react-components';
import Attribute from './Attribute';

interface Props {
  className?: string;
}

const Token = ({ className }: Props): React.ReactElement<Props> => {
  const { t } = useTranslation()
  const params = useParams<{ collectionId: string; tokenId: string }>();

  const collectionId = new BN(params.collectionId);
  const tokenId = new BN(params.tokenId);

  const attributes = useAttributeKeys(collectionId, tokenId)

  const headerRef = useRef([[t('attributes'), 'start', 1], [t('value'), 'start'], [t('deposit'), 'start']]);

  return (
    <div className={className}>
      <Summary collectionId={collectionId} tokenId={tokenId} />
      <Table className={className} empty={!attributes.length && t('No attributes found')} header={headerRef.current}>
        {attributes.map((k) => <Attribute attributeKey={k} collectionId={collectionId} tokenId={tokenId} />)}
      </Table>
    </div>
  );
};

export default React.memo(Token);
