import React from 'react';
import { Labelled } from '@polkadot/ui-app/index';

import MemoEdit from '@polkadot/joy-utils/memo/MemoEdit';
import TxButton from '@polkadot/joy-utils/TxButton';
import { withMyAccount, MyAccountProps } from '@polkadot/joy-utils/MyAccount';
import { nonEmptyStr } from '@polkadot/joy-utils/index';

type Props = MyAccountProps & {};

type State = {
  memo: string,
  isMemoValid: boolean
};

class Component extends React.PureComponent<Props, State> {

  state: State = {
    memo: '',
    isMemoValid: false
  };

  render () {
    const { myAddress } = this.props;
    const { memo, isMemoValid } = this.state;
    return (
      <>
        <MemoEdit accountId={myAddress || ''} onChange={this.onChangeMemo} />
        <Labelled style={{ marginTop: '.5rem' }}>
          <TxButton
            size='large'
            isDisabled={!isMemoValid}
            label='Update memo'
            params={[memo.trim()]}
            tx='memo.updateMemo'
          />
        </Labelled>
      </>
    );
  }

  onChangeMemo = (memo: string): void => {
    const isMemoValid = nonEmptyStr(memo);
    this.setState({ memo, isMemoValid });
  }
}

export default withMyAccount(Component);
