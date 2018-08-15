// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';
import { shallow } from '../../../test/enzyme';

import { Editor } from './Editor';
import UploadButton from './UploadButton';
import DownloadButton from './DownloadButton';

const mockT = (key, options) => (key);

describe('Editor', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Editor t={mockT} />, {});
  });

  it('creates the element', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('should only display Upload Button when no current address in state', () => {
    wrapper.setState({ currentPair: null });
    expect(wrapper.find(UploadButton)).toHaveLength(1);
  });

  it('should display both Upload and Download Button when current pair has address in state', () => {
    wrapper.setState({ currentPair: { address: jest.fn() } });
    expect(wrapper.find(UploadButton)).toHaveLength(1);
    expect(wrapper.find(DownloadButton)).toHaveLength(1);
  });
});
