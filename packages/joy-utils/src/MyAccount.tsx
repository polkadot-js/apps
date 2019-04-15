import React from 'react';
import store from 'store';
import { Container, Subscribe } from 'unstated';
import { Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { Option } from '@polkadot/types';
import { withCalls, withMulti } from '@polkadot/ui-api/with';

import { MemberId } from '@polkadot/joy-members/types';
import { queryMembershipToProp } from '@polkadot/joy-members/utils';
import { isKnownAddress } from './index';

export const MY_ADDRESS = 'joy.myAddress';

export type MyAddressProps = {
  myAddress?: string
};

export type MyAccountProps = MyAddressProps & {
  myMemberId?: MemberId,
  myMemberIdOpt?: Option<MemberId>,
  myMemberIdChecked?: boolean,
  iAmMember?: boolean
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

function withMyAddress<P extends MyAccountProps> (Component: React.ComponentType<P>) {
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

const withMyMemberId = withCalls<MyAccountProps>(
  queryMembershipToProp(
    'memberIdByAccountId', {
      paramName: 'myAddress',
      propName: 'myMemberIdOpt'
    }
  )
);

function withMyMembership<P extends MyAccountProps> (Component: React.ComponentType<P>) {
  return class extends React.Component<P> {
    render () {
      const { myMemberIdOpt } = this.props;
      const myMemberIdChecked = myMemberIdOpt !== undefined;
      const myMemberId = myMemberIdOpt && myMemberIdOpt.isSome
        ? myMemberIdOpt.unwrap() : undefined;
      const iAmMember = myMemberId !== undefined;

      const newProps = {
        myMemberIdChecked,
        myMemberId,
        iAmMember
      };

      return <Component {...this.props} {...newProps} />;
    }
  };
}

export const withMyAccount = <P extends MyAccountProps> (Component: React.ComponentType<P>) =>
withMulti(
  Component,
  withMyAddress,
  withMyMemberId,
  withMyMembership
);

export function OnlyMembers<P extends MyAccountProps> (Component: React.ComponentType<P>) {
  return class extends React.Component<P> {
    render () {
      const { myMemberIdChecked, iAmMember } = this.props;
      if (!myMemberIdChecked) {
        return <em>Loading...</em>;
      } else if (iAmMember) {
        return <Component {...this.props} />;
      } else {
        return (
          <Message warning className='JoyMainStatus'>
            <Message.Header>Only members can access this functionality.</Message.Header>
            <div style={{ marginTop: '1rem' }}>
              <Link to={`/members/edit`} className='ui button orange'>Register here</Link>
            </div>
          </Message>
        );
      }
    }
  };
}

export const withOnlyMembers = <P extends MyAccountProps> (Component: React.ComponentType<P>) =>
withMulti(
  Component,
  withMyAccount,
  OnlyMembers
);
