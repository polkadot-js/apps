// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';
import { mount } from '../../../test/enzyme';
import { Signer } from './Modal';

const mockT = (key, options) => (key);

describe('Signer', () => {
  let wrapper, fixtureQueueProp, fixtureCurrentItemState;

  beforeEach(() => {
    fixtureQueueProp = [{
      rpc: {
        isSigned: true
      },
      id: 'test',
      status: 'test'
    }];

    fixtureCurrentItemState = fixtureQueueProp[0];

    wrapper = mount(
      <Signer
        t={mockT}
        queue={fixtureQueueProp}
      />, {}
    );
  });

  it('creates the element', () => {
    expect(wrapper).toHaveLength(1);
  });

  it.skip('sets the state of the component', () => {
    wrapper.setState({ currentItem: fixtureCurrentItemState });
    wrapper = wrapper.update(); // immutable usage
    expect(wrapper.state('currentItem')).toEqual(fixtureCurrentItemState);
    console.log(wrapper.debug());
  });
});
