// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';
import AddressSummary from '@polkadot/ui-app/AddressSummary';
import { shallow } from '../../../test/enzyme';

import { Editor } from './Editor';

const sampleAddress = '5Fpq7JD6W441h1NFt3ayHrj6jGeacuK4d6EYq7GcfvQuAHuP';
const mockT = (key, options) => (key);

describe('Editor', () => {
  let fixtureState, wrapper;

  beforeEach(() => {
    fixtureState = {
      current: {
        address: jest.fn(() => sampleAddress)
      },
      editedName: 'my account',
      isEdited: false,
      isForgetOpen: false,
      previous: {
        address: jest.fn(() => sampleAddress)
      }
    };

    wrapper = shallow(<Editor t={mockT} />, {});
  });

  it('creates the element', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('should render DownloadButton component with address prop equal to current pair address', (done) => {
    try {
      wrapper.setState(fixtureState, () => {
        wrapper.update();
        expect(wrapper.state('editedName')).toEqual(fixtureState.editedName);
        expect(wrapper.find(AddressSummary)).toHaveLength(1);
        expect(wrapper.find(AddressSummary).props().buttonChildren.props).toEqual({ address: sampleAddress });
        done();
      });
    } catch (error) {
      console.error(error);
    }
  });
});
