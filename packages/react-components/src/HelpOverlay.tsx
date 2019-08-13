// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import ReactMd from 'react-markdown';
import styled from 'styled-components';

import Icon from './Icon';

interface Props extends BareProps {
  md: string;
}

interface State {
  isVisible: boolean;
}

const Wrapper = styled.div`
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

export default class HelpOverlay extends React.PureComponent<Props, State> {
  public state: State = { isVisible: false };

  public render (): React.ReactNode {
    const { md } = this.props;
    const { isVisible } = this.state;

    return (
      <Wrapper>
        {this.renderButton('help circle')}
        <div className={`help-slideout ${isVisible ? 'open' : 'closed'}`}>
          {this.renderButton('close')}
          <ReactMd
            className='help-content'
            escapeHtml={false}
            source={md}
          />
        </div>
      </Wrapper>
    );
  }

  private renderButton (name: 'close' | 'help circle'): React.ReactNode {
    return (
      <div className='help-button'>
        <Icon
          name={name}
          onClick={this.toggleVisible}
        />
      </div>
    );
  }

  private toggleVisible = (): void => {
    this.setState(({ isVisible }): State => ({
      isVisible: !isVisible
    }));
  }
}
