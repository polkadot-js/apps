import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { withCalls } from '@polkadot/ui-api/with';
import { Option, AccountId } from '@polkadot/types';
import IdentityIcon from '@polkadot/ui-app/IdentityIcon';
import BalanceDisplay from '@polkadot/ui-app/Balance';
import AddressMini from '@polkadot/ui-app/AddressMiniJoy';
import { formatNumber } from '@polkadot/ui-app/util';

import translate from './translate';
import { MemberId, Profile, EntryMethod, Paid, Screening,SubscriptionId } from './types';
import { queryMembershipToProp } from './utils';
import { Seat } from '@polkadot/joy-utils/types';
import { nonEmptyStr, queryToProp } from '@polkadot/joy-utils/index';
import { MyAccountProps, withMyAccount } from '@polkadot/joy-utils/MyAccount';

type Props = ApiProps & I18nProps & MyAccountProps & {
  preview?: boolean,
  memberId: MemberId,
  memberProfile?: Option<any>, // TODO refactor to Option<Profile>
  accountIdByMemberId?: AccountId,
  activeCouncil?: Seat[]
};

class Component extends React.PureComponent<Props> {

  render () {
    const { memberProfile } = this.props;
    return memberProfile
      ? this.renderProfile(memberProfile.unwrap() as Profile)
      : null;
  }

  private renderProfile (memberProfile: Profile) {
    const {
      preview = false,
      myAddress,
      activeCouncil = [],
      accountIdByMemberId: accountId
    } = this.props;

    const {
      handle,
      avatar_uri
    } = memberProfile;

    const hasAvatar = avatar_uri && nonEmptyStr(avatar_uri.toString());
    const isMyProfile = myAddress && accountId && myAddress === accountId.toString();
    const isCouncilor: boolean = accountId !== undefined && activeCouncil.find(x => accountId.eq(x.member)) !== undefined;

    return (
      <>
      <div className={`item ProfileDetails ${isMyProfile && 'MyProfile'}`}>
        {hasAvatar
          ? <img className='ui avatar image' src={avatar_uri.toString()} />
          : <IdentityIcon className='image' value={accountId} size={40} />
        }
        <div className='content'>
          <div className='header'>
            <Link to={`/members/${handle.toString()}`} className='handle'>{handle.toString()}</Link>
            {isMyProfile && <Link to={`/members/edit`} className='ui tiny button'>Edit my profile</Link>}
          </div>
          <div className='description'>
            {isCouncilor &&
              <b className='muted text' style={{ color: '#607d8b' }}>
                <i className='university icon'></i>
                Council member
              </b>}
            <BalanceDisplay label='Balance: ' value={accountId} />
          </div>
        </div>
      </div>
      {!preview && this.renderDetails(memberProfile, isCouncilor)}
      </>
    );
  }

  private renderDetails (memberProfile: Profile, isCouncilor: boolean) {
    const {
      accountIdByMemberId: accountId
    } = this.props;

    const {
      id,
      about,
      registered_at_block,
      registered_at_time,
      entry,
      suspended,
      subscription
    } = memberProfile;

    return (
      <Table celled selectable compact definition className='ProfileDetailsTable'>
      <Table.Body>
      <Table.Row>
        <Table.Cell>Membership ID</Table.Cell>
        <Table.Cell>{id.toNumber()}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Primary account</Table.Cell>
        <Table.Cell><AddressMini value={accountId} isShort={false} isPadded={false} size={36} withName withBalance /></Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Registered on</Table.Cell>
        <Table.Cell>{new Date(registered_at_time).toLocaleString()} at block #{formatNumber(registered_at_block)}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Suspended?</Table.Cell>
        <Table.Cell>{suspended.eq(true) ? 'Yes' : 'No'}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Council member?</Table.Cell>
        <Table.Cell>{isCouncilor ? 'Yes' : 'No'}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Entry method</Table.Cell>
        <Table.Cell>{this.renderEntryMethod(entry)}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Subscription ID</Table.Cell>
        <Table.Cell>{this.renderSubscription(subscription)}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>About</Table.Cell>
        <Table.Cell><ReactMarkdown className='JoyMemo--full' source={about.toString()} linkTarget='_blank' /></Table.Cell>
      </Table.Row>
      </Table.Body>
      </Table>
    );
  }

  private renderEntryMethod (entry: EntryMethod) {
    const etype = entry.type;
    if (etype === Paid.name) {
      const paid = entry.value as Paid;
      return <div>Paid, term ID: {paid.toNumber()}</div>;
    } else if (etype === Screening.name) {
      const accountId = entry.value as Screening;
      return <div>Screened by <AddressMini value={accountId} isShort={false} isPadded={false} size={36} withName withBalance /></div>;
    } else {
      return <em className='muted text'>Unknown</em>;
    }
  }

  private renderSubscription (subscription: Option<SubscriptionId>) {
    return subscription.isNone
      ? <em className='muted text'>No subscription yet.</em>
      : subscription.value.toString();
  }
}

export default translate(withMyAccount(
  withCalls<Props>(
    queryToProp('query.council.activeCouncil'),
    queryMembershipToProp('memberProfile', 'memberId'),
    queryMembershipToProp('accountIdByMemberId', 'memberId')
  )(Component)
));
