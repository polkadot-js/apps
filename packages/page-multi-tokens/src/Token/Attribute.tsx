// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';

import { u128 } from '@polkadot/types';
import { BN, formatNumber } from '@polkadot/util';
import useAttributeData from '../useAttributeData';
import styled from 'styled-components';

interface Props {
  className?: string;
  collectionId: BN;
  tokenId: BN;
  attributeKey: u128;
}

const Attribute = ({ className, collectionId, tokenId, attributeKey }: Props): React.ReactElement<Props> => {
  const data = useAttributeData(collectionId, attributeKey, tokenId);

  const possiblyOpenLink = useCallback(() => {
    if (data) {
      const key = attributeKey.toHuman();
      const isLink = ['url', 'uri', 'link'].includes(key.toLowerCase());
      const isIPFS = key.toLowerCase() === 'ipfs';
      const isIPNS = key.toLowerCase() === 'ipns';

      if (isLink && data?.value) {
        window.open(data.value.toHuman(), '_blank');
      }

      if (isIPFS && data?.value) {
        window.open(`https://ipfs.io/ipfs/${data.value.toHuman()}`, '_blank');
      }

      if (isIPNS && data?.value) {
        window.open(`https://ipfs.io/ipns/${data.value.toHuman()}`, '_blank');
      }
    }
  }, [data, attributeKey]);

  return (
    <tr key={attributeKey.toString()}>
      <td>{(attributeKey as u128).toHuman()}</td>
      <Link onClick={possiblyOpenLink}>{data?.value?.toHuman()}</Link>
      <td>{formatNumber(data?.deposit)}</td>
    </tr>
  );
};

export default React.memo(Attribute);

const Link = styled.td`
  cursor: pointer;
  color: #4183c4 !important;
`;
