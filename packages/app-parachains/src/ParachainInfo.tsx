// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveParachainInfo } from '@polkadot/api-derive/types';

import React from 'react';
import styled from 'styled-components';

import { useTranslation } from './translate';

interface Props {
  children?: React.ReactNode;
  className?: string;
  info: DeriveParachainInfo | null;
  isBig?: boolean;
}

function ParachainInfo ({ children, className, isBig, info }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={[className, isBig ? 'big' : ''].join(' ')}>
      <div className='chain-icon'>
        {
          info?.icon
            ? (
              <img src={info.icon} />
            )
            : (
              <i
                className='icon chain fitted'
              />
            )
        }
      </div>
      <div className='details'>
        <div className='name'>
          {info?.name || t('Unknown Chain')}
        </div>
        <div className='owner'>
          {info?.owner || t('Unknown Owner')}
        </div>
      </div>
      {children}
    </div>
  );
  // return (
  //   <Card className={className}>
  //     <div className='ui--Row'>
  //       <div className='ui--Row-base'>
  //         <div className='ui--Row-details parachains--Item-header'>
  //           <h3>#{formatNumber(id)}</h3>
  //         </div>
  //       </div>
  //       <Static
  //         help={t('the watermark block height of this parachain')}
  //         label={t('watermark')}
  //         value={(
  //           <h1>
  //             #{formatNumber(watermarks)}
  //           </h1>
  //         )}
  //       />
  //       <Static
  //         help={t('the last heads of this parachain')}
  //         label={t('heads')}
  //         value={heads?.toHex() || t('<unknown>')}
  //       />
  //       <Static
  //         help={t('the relay dispatch queue size')}
  //         label={t('relay queue')}
  //         value={
  //           relayDispatchQueue
  //             ? formatNumber(relayDispatchQueue.length)
  //             : '-'
  //         }
  //       />
  //     </div>
  //   </Card>
  // );
}

export default styled(ParachainInfo)`
  & {
    display: flex;
    align-items: center;

    .chain-icon {
      width: 2.4rem;
      height: 2.4rem;
      background: #e03997;
      border-radius: 50%;
      color: white;
      margin-right: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;

      > * {
        width:100%;
      }

      > i.icon {
        height: auto !important;
      }

      > img {
        height: 100%;
      }
    }

    .details {
      flex: 1;

      .name {
        font-weight: bold;
        font-size: 1rem;
      }

      .owner {
        color: rgba(100, 100, 100, 0.6);
        font-size: 1rem;
      }
    }

    &.big {
      .chain-icon {
        width: 3.4rem;
        height: 3.4rem;
        margin-right: 0.6rem;

        > i.icon {
          font-size: 1.6rem;
        }
      }

      .details {
        .name {
          font-size: 1.4rem;
          line-height: 1.4rem;
        }
      }
    }
  }
`;
