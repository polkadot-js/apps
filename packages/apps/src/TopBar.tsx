import React from 'react';
import { Link } from 'react-router-dom';
import { Subscribe } from 'unstated';
import { I18nProps } from '@polkadot/ui-app/types';
import { MyAccountContainer } from '@polkadot/joy-utils/MyAccount';
import AddressMini from '@polkadot/ui-app/AddressMiniJoy';
import translate from './translate';
import './TopBar.css';

type Props = I18nProps & {};

type State = {};

class Component extends React.PureComponent<Props, State> {
  state: State = {};

  renderAddress (address: string) {
    const marginRight = { marginRight: '.5rem' };
    return <div className='JoyTopBar'>
      <span style={marginRight}>My key: </span>
      <AddressMini value={address} isShort={false} isPadded={false} withBalance={true} withName={true} size={36} style={marginRight} />
      <Link className='ui small button inverted' to='/accounts'>Change key</Link>
    </div>;
  }

  renderNoAddress () {
    return <div className='JoyTopBar NoMyAddress'>
      <i className='warning sign icon'></i>
      <span style={{ marginRight: '1rem' }}>You need to create a key if you want to use all features.</span>
      <Link className='ui small button orange' to='/accounts'>Create key</Link>
    </div>;
  }

  render () {
    return <Subscribe to={[MyAccountContainer]}>{(me: MyAccountContainer) =>
      me.hasAddress()
        ? this.renderAddress(me.state.address)
        : this.renderNoAddress()
    }</Subscribe>;
  }
}

export default translate(Component);
