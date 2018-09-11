// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';
import { shallow } from '../../../test/enzyme';

import { Editor } from './Editor';
import { DownloadButton } from './DownloadButton';

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

  it('should display download button when a current address exists', (done) => {
    try {
      wrapper.setState(fixtureState, () => {
        wrapper.update();
        expect(wrapper.state('editedName')).toEqual(fixtureState.editedName);
        // console.log(wrapper.debug());
        expect(wrapper.find(DownloadButton)).toHaveLength(1);
        done();
      });
    } catch (error) {
      console.error(error);
    }
  });
});
