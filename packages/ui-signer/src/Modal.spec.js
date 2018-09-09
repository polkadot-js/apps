// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';
import { shallow } from '../../../test/enzyme';
import { Signer } from './Modal';

const mockT = (key, options) => (key);

describe('Signer', () => {
  let wrapper, expectedNextCurrentItemState, fixtureCurrentItemState, fixtureQueueProp, inputPassword;

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
      />
    );
  });

  it('creates the element', () => {
    expect(wrapper).toHaveLength(1);
    console.log(wrapper.debug());
  });

  // Resolution of Enzyme issue: https://github.com/airbnb/enzyme/issues/1794
  it.skip('set the state of the component using async await', async () => {
    try {
      await wrapper.setState({
        currentItem: fixtureCurrentItemState,
        password: '123',
        unlockError: null
      });

      await wrapper.setProps({
        queue: fixtureQueueProp
      });

      expect(wrapper.update().state('currentItem')).toEqual(expectedNextCurrentItemState);
      wrapper.children().debug();
      expect(wrapper.update().find('.ui--signer-Signer')).toHaveLength(1);
      expect(wrapper.update().find('.ui--signer-Signer-Unlock')).toHaveLength(1);
      // check no password input field validation error
      expect(wrapper.update().find('.ui--signer-Signer-Unlock').closest('input').parent().hasClass('ui action input')).toBe(true);
      inputPassword = wrapper.find('.ui--signer-Signer-Unlock').find('input');
      const enterKey = 'Enter';
      inputPassword.simulate('keyDown', {key: enterKey});
      // check password input field validation error when press enter without password
      expect(wrapper.update().find('.ui--signer-Signer-Unlock').closest('input').parent().hasClass('ui error action input')).toBe(true);
    } catch (error) {
      console.error(error);
    }
  });
});
