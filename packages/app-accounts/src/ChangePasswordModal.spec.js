// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';
import { shallow } from '../../../test/enzyme';

import { ChangePasswordModal } from './ChangePasswordModal';

const mockT = (key, options) => (key);

describe('ChangePasswordModal', () => {
  let wrapper, emptyErrorPropFixture;

  beforeEach(() => {
    emptyErrorPropFixture = {
      props: {
        props: {
          inputError: {
            password: '',
            newPassword: ''
          },
          formError: ''
        }
      }
    };

    wrapper = shallow(<ChangePasswordModal error={emptyErrorPropFixture} t={mockT} />, {});
  });

  it('creates the element', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('should only render Change Password Modal when prop values set for isPasswordModalOpen modal toggler', () => {
    return new Promise((resolve) => {
      wrapper.setProps({ isPasswordModalOpen: true }, resolve);
    }).then(() => {
      wrapper.update();

      expect(wrapper.find('.accounts--ChangePassword-Modal')).toHaveLength(1);
    });
  });
});
