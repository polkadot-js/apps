// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';

import { mount } from '../../../test/enzyme';
import Input from './Input';
import { InputNumber } from './InputNumber';

const mockT = (key, options) => (key);

describe('Balance', () => {
  let wrapper, divInputNumber, divNotifications, divNotificationsText, inputElement, defaultValue;

  beforeEach(() => {
    defaultValue = { value: '0' };
    wrapper = mount(
      <InputNumber
        defaultValue={defaultValue}
        t={mockT}
      />, {}
    );
    divInputNumber = wrapper.find('.ui--InputNumber');
    divNotifications = wrapper.find('.ui--Notifications');
    inputElement = wrapper.find('.ui--InputNumber').find(Input).find('input');
  });

  it('creates the element', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('should display InputNumber wrapper and Input component', () => {
    expect(divInputNumber).toHaveLength(1);
    expect(wrapper.find(Input)).toHaveLength(1);
  });

  it('should not display Notifications by default', () => {
    // console.log(inputElement.get(0));
    expect(divNotifications).toHaveLength(0);
  });

  it('should display correct Info Notification in exponential notation when user inputs integer value', () => {
    inputElement.simulate('change', { target: { value: '99' } });
    wrapper.update();
    divNotificationsText = wrapper.find('.ui--Notifications').find('div.message');
    expect(divNotificationsText.hasClass('info')).toBe(true);
    expect(divNotificationsText.text()).toEqual('number.info.scientific');
  });

  it('should not display Info Notification when user inputs a value containing a decimal point', () => {
    inputElement.simulate('change', { target: { value: '9.' } });
    wrapper.update();
    expect(divNotifications).toHaveLength(0);
  });

  it('should not display Info Notification when user inputs a value where first character is a decimal point', () => {
    inputElement.simulate('change', { target: { value: '.' } });
    wrapper.update();
    expect(divNotifications).toHaveLength(0);
  });

  it('should display correct i18n Warning Notification when user enters zero', () => {
    inputElement.simulate('change', { target: { value: '0' } });
    wrapper.update();
    divNotificationsText = wrapper.find('.ui--Notifications').find('div.message');
    expect(divNotificationsText.hasClass('warning')).toBe(true);
    expect(divNotificationsText.text()).toEqual('number.warn.zero');
  });

  it('should display correct i18n Error Notification when user resets the value', () => {
    inputElement.simulate('change', { target: { value: '' } });
    wrapper.update();
    expect(divNotifications).toHaveLength(0);
  });

  it('should not display i18n Error Notification when user enters decimal value greater than max bit length', () => {
    inputElement.simulate('change', { target: { value: '0.1111111111111111111111111111111111111' } });
    wrapper.update();
    expect(divNotifications).toHaveLength(0);
  });

  it('should not display i18n Error Notification when user enters positive value greater than or equal to the 128 bits maximum for latest chain', () => {
    inputElement.simulate('change', { target: { value: '340282366920938463463374607431768211455' } }); // 2^128
    wrapper.update();
    expect(divNotifications).toHaveLength(0);
  });

  it('should not display error when user enters positive value less than the 128 bits maximum for latest chain', () => {
    inputElement.simulate('change', { target: { value: '340282366920938463463374607431768211454' } }); // 2^128 - 1
    wrapper.update();
    expect(divNotifications).toHaveLength(0);
  });

  it('should not display i18n Error Notification when user enters letter value', () => {
    inputElement.simulate('change', { target: { value: 'e' } });
    wrapper.update();
    expect(divNotifications).toHaveLength(0);
  });

  it('should not display i18n Error Notification when user enters symbol value', () => {
    inputElement.simulate('change', { target: { value: '%' } });
    wrapper.update();
    expect(divNotifications).toHaveLength(0);
  });
});
