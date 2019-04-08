// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import ReactMd from 'react-markdown';
import styled from 'styled-components';

import Icon from './Icon';

type Props = BareProps & {
  md: string
};

type State = {
  isVisible: boolean
};

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
    max-width: 50rem;
    overflow-y: scroll;
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10;

    .help-button {
      text-align: right;
    }

    .help-content {
      padding: 1rem 1.5rem 5rem;
    }
  }
`;

export default class HelpOverlay extends React.PureComponent<Props, State> {
  state: State = { isVisible: false };

  render () {
    return (
      <Wrapper>
        {this.renderButton('help circle')}
        {this.renderSlideout()}
      </Wrapper>
    );
  }

  private renderButton (name: 'close' | 'help circle') {
    return (
      <div className='help-button'>
        <Icon
          name={name}
          onClick={this.toggleVisible}
        />
      </div>
    );
  }

  private renderSlideout () {
    const { md } = this.props;
    const { isVisible } = this.state;

    if (!isVisible) {
      return null;
    }

    return (
      <div className='help-slideout'>
        {this.renderButton('close')}
        <ReactMd
          className='help-content'
          escapeHtml={false}
          source={md}
        />
      </div>
    );
  }

  private toggleVisible = () => {
    this.setState(({ isVisible }) => ({
      isVisible: !isVisible
    }));
  }
}
