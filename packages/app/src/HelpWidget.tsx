// Copyright 2017-2021 @canvas-ui/app authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as moment from 'moment';
import React, { useState } from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
}

const HelpWidget = ({ className }: Props) => {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    !visible ? setVisible(true) : setVisible(false);
  };

  return (
    <div className={className}>
      {visible &&
          <div className={'help-menu'}>
            <div className='help-menu-items'>
              <a
                href='https://substrate.dev/docs/en/knowledgebase/smart-contracts/'
                rel='noopener noreferrer'
                target='blank'
              >
                  ink! smart contracts docs
              </a>
              <a
                href='https://github.com/paritytech/canvas-ui'
                rel='noopener noreferrer'
                target='blank'
              >
                GitHub repository
              </a>
            </div>
            <div className='imprint'>{moment.utc().year()} Parity Technologies</div>
          </div>
      }
      <div
        className={'help-button'}
        onClick={handleClick}
        role='button'>
          ?
      </div>
    </div>
  );
};

export default styled(HelpWidget)`
  position: fixed;
  z-index: 101;
  right: 20px;
  bottom: 20px;

  .help-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    user-select: none;
    cursor: pointer;
    background: var(--grey20);
    color: var(--grey80);
    right: 0px;
    bottom: 0px;
    width: 36px;
    height: 36px;
    border-radius: 100%;
    font-size: 1.5rem;
    box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.2) 0px 3px 6px, rgba(15, 15, 15, 0.4) 0px 9px 24px;
  }

    .help-menu {
      display: flex;
      align-items: center;
      flex-direction: column;
      position: absolute;
      right: 0px;
      bottom: 46px;
      width: 200px;
      background: var(--grey30);
      font-size: 1rem;
      border-radius: var(--btn-radius-default);
      box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.2) 0px 3px 6px, rgba(15, 15, 15, 0.4) 0px 9px 24px;

      .help-menu-items {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 4px 0;
      }

      a {
        width: 100%;
        padding: 8px 12px;
        color: var(--grey80);
        transition: background 120ms ease-in 0s;
        &:hover {
          background: var(--grey40);
          color: var(--grey80);
        }
      }

      .imprint {
        width: 100%;
        padding: 8px 12px;
        font-size: 12px;
        color: var(--grey70);
        border-top: solid 1px var(--grey40);
      }
    }
`;
