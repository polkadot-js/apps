import React from 'react';
import store from 'store';
import { Container, Subscribe } from 'unstated';
import { isKnownAddress } from './index';

export const MY_ADDRESS = 'joy.myAddress';

export type MyAccountProps = {
  myAddress?: string
};

export type MyAccountState = {
  address?: string
};

export class MyAccountContainer extends Container<MyAccountState> {

  state = {
    address: store.get(MY_ADDRESS)
  };

  setAddress (address: string) {
    store.set(MY_ADDRESS, address);
    this.setState({ address });
  }

  forgetAddress () {
    store.remove(MY_ADDRESS);
    this.setState({ address: undefined });
  }

  hasAddress () {
    return isKnownAddress(this.state.address);
  }
}

export function withMyAccount<P extends MyAccountProps> (Component: React.ComponentType<P>) {
  return class extends React.Component<P> {
    render () {
      return (
        <Subscribe to={[ MyAccountContainer ]}>{(me: MyAccountContainer) =>
          <Component myAddress={me.state.address} {...this.props} />
        }</Subscribe>
      );
    }
  };
}
