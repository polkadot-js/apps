// Copyright 2017-2025 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Preimage as TPreimage } from '@polkadot/react-hooks/types';

import React from 'react';

import { AddressMini, styled } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import Call from '../Call.js';
import Hash from '../Hash.js';

interface Props {
  className?: string;
  depositor: string,
  preimageInfos: TPreimage[];
}

const Preimage = ({ className, depositor, preimageInfos }: Props) => {
  return (
    <>
      {preimageInfos.map((info, index) => {
        return (
          <StyledTr
            className={`isExpanded ${className}`}
            isFirstItem={index === 0}
            isLastItem={index === preimageInfos.length - 1}
            key={info.proposalHash}
          >
            <td
              className='address all'
              style={{ paddingTop: 15, verticalAlign: 'top' }}
            >
              {index === 0 && <AddressMini value={depositor} />}
            </td>
            <Call value={info} />
            <Hash value={info.proposalHash} />
            <td className='number media--1000'>
              {info?.proposalLength
                ? formatNumber(info.proposalLength)
                : <span className='--tmp'>999,999</span>}
            </td>
            <td className='preimageStatus start media--1100 together'>
              {info
                ? (
                  <>
                    {info.status && (<div>{info.status?.type}{info.count !== 0 && <>&nbsp;/&nbsp;{formatNumber(info.count)}</>}</div>)}
                  </>
                )
                : <span className='--tmp'>Unrequested</span>}
            </td>
          </StyledTr>
        );
      })}
    </>
  );
};

const BASE_BORDER = 0.125;
const BORDER_TOP = `${BASE_BORDER * 3}rem solid var(--bg-page)`;
const BORDER_RADIUS = `${BASE_BORDER * 4}rem`;

const StyledTr = styled.tr<{isFirstItem: boolean; isLastItem: boolean}>`
  td {
    border-top: ${(props) => props.isFirstItem && BORDER_TOP};
    border-radius: 0rem !important;
    
      &:first-child {
        padding-block: 1rem !important;
        border-top-left-radius: ${(props) => props.isFirstItem ? BORDER_RADIUS : '0rem'}!important;
        border-bottom-left-radius: ${(props) => props.isLastItem ? BORDER_RADIUS : '0rem'}!important;
      }

      &:last-child {
        border-top-right-radius: ${(props) => props.isFirstItem ? BORDER_RADIUS : '0rem'}!important;
        border-bottom-right-radius: ${(props) => props.isLastItem ? BORDER_RADIUS : '0rem'}!important;
      }
  }
`;

export default React.memo(Preimage);
