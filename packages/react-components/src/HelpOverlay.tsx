// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React, { useState } from 'react';
import ReactMd from 'react-markdown';
import styled from 'styled-components';

import Icon from './Icon';

interface Props extends BareProps {
  md: string;
}

function HelpOverlay ({ className, md }: Props): React.ReactElement<Props> {
  const [isVisible, setIsVisible] = useState(false);

  const _toggleVisible = (): void => setIsVisible(!isVisible);

  return (
    <div className={className}>
      <div className='help-button'>
        <Icon
          name='help circle'
          onClick={_toggleVisible}
        />
      </div>
      <div className={`help-slideout ${isVisible ? 'open' : 'closed'}`}>
        <div className='help-button'>
          <Icon
            name='close'
            onClick={_toggleVisible}
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

export default styled(HelpOverlay)`
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
`;
