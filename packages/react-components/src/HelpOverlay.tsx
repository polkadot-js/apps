// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import ReactMd from 'react-markdown';
import styled from 'styled-components';
import { useToggle } from '@polkadot/react-hooks';

import Icon from './Icon';

interface Props {
  className?: string;
  md: string;
}

function HelpOverlay ({ className = '', md }: Props): React.ReactElement<Props> {
  const [isVisible, toggleVisible] = useToggle();

  return (
    <div className={className}>
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
          escapeHtml={false}
          source={md}
        />
      </div>
    </div>
  );
}

export default React.memo(styled(HelpOverlay)`
  .help-button {
    cursor: pointer;
    font-size: 2rem;
    padding: 1.25rem 1.5rem 0 0;
  }

  > .help-button {
    position: absolute;
    right: 0rem;
    top: 0rem;
  }

  .help-slideout {
    background: #eee;
    border-left: 0.25rem solid #ddd;
    bottom: 0;
    max-width: 50rem;
    overflow-y: scroll;
    position: fixed;
    right: -50rem;
    top: 0;
    transition-duration: .5s;
    transition-property: all;
    z-index: 10;

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
