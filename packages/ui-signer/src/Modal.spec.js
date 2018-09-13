// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';

import { shallow } from '../../../test/enzyme';
import { Signer } from './Modal';

const mockT = (key, options) => (key);

describe('Signer', () => {
  let expectedNextCurrentItemState, fixtureCurrentItemState, fixtureQueueProp, unlockComponent, wrapper;

  beforeEach(() => {
    fixtureCurrentItemState = {
      rpc: {
        isSigned: true
      },
      id: 'test1',
      publicKey: new Uint8Array([1]),
      status: 'sending'
    };

    fixtureQueueProp = [{
      rpc: {
        isSigned: true
      },
      id: 'test2',
      publicKey: new Uint8Array([2]),
      status: 'queued'
    }];

    expectedNextCurrentItemState = fixtureQueueProp[0];

    wrapper = shallow(
      <Signer
        t={mockT}
        queue={[]}
      />, {}
    );
  });

  it('creates the element', () => {
    return new Promise((resolve) => {
      wrapper.setState({
        currentItem: fixtureCurrentItemState,
        password: '123',
        unlockError: null
      }, () => {
        wrapper.setProps({
          queue: fixtureQueueProp
        }, resolve);
      });
    }).then(() => {
      wrapper.update();
      expect(wrapper).toHaveLength(1);
    });
  });

  // Reference: https://github.com/airbnb/enzyme/issues/1794
  it('renders Unlock component with empty password', () => {
    return new Promise((resolve) => {
      wrapper.setState({
        currentItem: fixtureCurrentItemState,
        password: '123',
        unlockError: null
      }, () => {
        wrapper.setProps({
          queue: fixtureQueueProp
        }, resolve);
      });
    }).then(() => {
      wrapper.update();
      expect(wrapper.state('currentItem')).toEqual(expectedNextCurrentItemState);
      expect(wrapper.find('.ui--signer-Signer')).toHaveLength(1);
      unlockComponent = wrapper.find('.ui--signer-Signer').children().at(0).childAt(0);
      expect(unlockComponent.props().password).toEqual('');
    });
  });
});
