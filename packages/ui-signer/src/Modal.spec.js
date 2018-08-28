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

  // Pending resolution of Enzyme issue: https://github.com/airbnb/enzyme/issues/1794
  it.skip('set the state of the component using callbacks and anonymous function', (done) => {
    wrapper.setState({ currentItem: fixtureCurrentItemState }, () => {
      expect(wrapper.update().state('currentItem')).toEqual(fixtureCurrentItemState);
      expect(wrapper.update().find('.ui--signer-Signer')).toHaveLength(1);
      done();
    });
  });

  it.skip('set the state of the component using callbacks and named functions', (done) => {
    const checkExpectation = (done) => {
      expect(wrapper.update().state('currentItem')).toEqual(fixtureCurrentItemState);
      done();
    };

    const doAsyncAction = (callback, done) => {
      wrapper.setState({ currentItem: fixtureCurrentItemState }, () => {
        callback(done);
      });
    };

    doAsyncAction(checkExpectation, done);
  });

  it.skip('set the state of the component using promises', () => {
    Promise.resolve(wrapper.setState({ currentItem: fixtureCurrentItemState }))
      .then(_ => {
        expect(wrapper.update().state('currentItem')).toEqual(fixtureCurrentItemState);
        expect(wrapper.update().find('.ui--signer-Signer')).toHaveLength(1);
      })
      .catch((error) => console.log('error', error));
  });

  it.skip('set the state of the component using async await', async () => {
    try {
      await wrapper.setState({ currentItem: fixtureCurrentItemState });

      expect(wrapper.update().state('currentItem')).toEqual(fixtureCurrentItemState);
      expect(wrapper.update().find('.ui--signer-Signer')).toHaveLength(1);
    } catch (error) {
      console.error(error);
    }
  });
});
