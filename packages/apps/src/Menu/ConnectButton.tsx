// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';

import { extensionList, getUserInstalledExtensions, PreppedExtension } from '@polkadot/apps-config';
import Icon from '@polkadot/react-components/Icon';

import { useTranslation } from '../translate';
import ConnectExtension from './ConnectExtension';

const SHA_COL = 'rgba(34, 36, 38, 0.12)';
const SHA_OFF = '5px';

interface ConnectButtonProps {
  className: string;
}

const ConnectButton = ({ className }: ConnectButtonProps) => {
  const { t } = useTranslation();
  const [preppedExtensions, setPreppedExtensions] = useState<PreppedExtension[]>([]);

  useEffect(() => {
    const result: PreppedExtension[] = extensionList.map((extension) => {
      if (getUserInstalledExtensions().userExtensions.includes(extension.name)) {
        return { ...extension, isInstalled: true };
      } else {
        return { ...extension, isInstalled: false };
      }
    });

    setPreppedExtensions(result);
  }, []);

  if (preppedExtensions.length === 0) {
    return null;
  }

  return (
    <li className={className}>
      <div className='groupHdr highlight--color-contrast'>
        <Icon icon='plug' />
        <span>{t<string>('Connect')}</span>
      </div>
      <ul className='groupMenu'>
        {preppedExtensions.map(({ browsers, isInstalled, name }, key) => (
          <ConnectExtension
            browsers={browsers}
            isInstalled={isInstalled}
            key={key}
            name={name}
          />
        ))}
      </ul>
    </li>
  );
};

export default memo(styled(ConnectButton)`
  position: relative;
  cursor: pointer;

  .groupHdr {
    border-radius: 0.25rem;
    padding: 0.857rem 1.375rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.214rem;

    > .ui--Icon {
      margin-right: 0.5rem;
    }
  }

  &:hover {
    .groupHdr {
      background-color: var(--bg-tabs);
      box-shadow: 0px 4px 37px rgba(0, 0, 0, 0.08);
      padding-bottom: 2rem;
      margin-bottom: -2rem;
    }

    .groupMenu {
      display: block;

      > li:hover {
        background: var(--bg-menu-hover);

        :first-child {
          border-radius: 0 0.25rem 0 0;
        }
      }
    }
  }

  .groupMenu {
    display: none;
    position: absolute;
    top: 2.9rem;
    padding: 0;
    border-radius: 0.25rem;
    box-shadow: 0 ${SHA_OFF} ${SHA_OFF} -${SHA_OFF} ${SHA_COL}, ${SHA_OFF} 0 ${SHA_OFF} -${SHA_OFF} ${SHA_COL}, -${SHA_OFF} 0 ${SHA_OFF} -${SHA_OFF} ${SHA_COL};
    z-index: 250;

    > li {
      display: flex;
      height: 2.57rem;
      align-items: center;
      padding: 0 1.15rem 0;
      text-decoration: none;
      font-size: 1rem;
      white-space: nowrap;

      img {
        width: 20px;
        margin-right: 5px;
      }
    }

    &::before {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      content: ' ';
      border-radius: 0.25rem;
      z-index: -1;
    }
  }

  .extension-link {
    margin-left: 20px;

    :hover {
      text-decoration: underline;
    }
  }
`);
