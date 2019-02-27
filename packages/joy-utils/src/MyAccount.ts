import store from 'store';
import { Container } from 'unstated';
import { isKnownAddress } from './index';

export const MY_ADDRESS = 'joy.myAddress';

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
