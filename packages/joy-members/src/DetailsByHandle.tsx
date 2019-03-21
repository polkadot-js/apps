import React from 'react';

import { I18nProps } from '@polkadot/ui-app/types';
import { withCalls } from '@polkadot/ui-api/with';
import { Option } from '@polkadot/types';
import { stringToU8a, u8aToHex } from '@polkadot/util';

import translate from './translate';
import Details from './Details';
import { MemberId } from './types';
import { queryMembershipToProp } from './utils';

type DetailsByHandleProps = {
  handle: string,
  handles?: Option<MemberId>
};

function DetailsByHandleInner (p: DetailsByHandleProps) {
  const { handles: memberIdOpt } = p;
  if (memberIdOpt) {
    return memberIdOpt.isNone
      ? <em>Member profile not found.</em>
      : <div className='ui massive relaxed middle aligned list FullProfile'>
        <Details memberId={memberIdOpt.unwrap()} />
      </div>;
  } else return <em>Loading member's profile...</em>;
}

const DetailsByHandle = withCalls<DetailsByHandleProps>(
  queryMembershipToProp('handles', 'handle')
)(DetailsByHandleInner);

type Props = I18nProps & {
  match: {
    params: {
      handle: string
    }
  }
};

class Component extends React.PureComponent<Props> {
  render () {
    const { match: { params: { handle } } } = this.props;
    const handleHex = u8aToHex(stringToU8a(handle));
    return (
      <DetailsByHandle handle={handleHex} />
    );
  }
}

export default translate(Component);
