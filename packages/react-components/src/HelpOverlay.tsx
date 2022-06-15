// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import ReactMd from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import styled from 'styled-components';

import { useToggle } from '@polkadot/react-hooks';

import Icon from './Icon';

interface Props {
  className?: string;
  md: string;
}

const rehypePlugins = [rehypeRaw];

function HelpOverlay ({ className = '', md }: Props): React.ReactElement<Props> {
  const [isVisible, toggleVisible] = useToggle();

  return (
    <div className={`ui--HelpOverlay ${className}`}>
      <div className='help-button'>
        <Icon
          icon='question-circle'
          onClick={toggleVisible}
        />
      </div>
      <div className={`help-slideout ${isVisible ? 'open' : 'closed'}`}>
        <div className='help-button'>
          <Icon
            icon='times'
            onClick={toggleVisible}
          />
        </div>
        <ReactMd
          className='help-content'
          rehypePlugins={rehypePlugins}
        >
          {md}
        </ReactMd>
      </div>
    </div>
  );
}

export default React.memo(styled(HelpOverlay)`
  .help-button {
    color: var(--color-text);
    cursor: pointer;
    font-size: 2rem;
    padding: 0.35rem 1.5rem 0 0;
  }

  > .help-button {
    position: absolute;
    right: 0rem;
    top: 0rem;
    z-index: 10;
  }

  .help-slideout {
    background: var(--bg-page);
    box-shadow: -6px 0px 20px 0px rgba(0, 0, 0, 0.3);
    bottom: 0;
    max-width: 50rem;
    overflow-y: scroll;
    position: fixed;
    right: -50rem;
    top: 0;
    transition-duration: .5s;
    transition-property: all;
    z-index: 225; /* 5 more than menubar */

    .help-button {
      text-align: right;
    }

    .help-content {
      padding: 1rem 1.5rem 5rem;
    }

    &.open {
      right: 0;
    }
  }
`);
