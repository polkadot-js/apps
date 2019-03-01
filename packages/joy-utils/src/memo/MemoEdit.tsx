import BN from 'bn.js';
import React from 'react';

import { withCalls } from '@polkadot/ui-api/with';

import { nonEmptyStr } from '../index';
import TextArea from '../TextArea';
import { u8aToString } from '@polkadot/util';

type Props = {
  accountId: string,
  onChange: (memo: string) => void,
  maxLen?: BN,
  storedMemo?: Uint8Array
};

type State = {
  memo: string
};

class Component extends React.PureComponent<Props, State> {

  static getDerivedStateFromProps (props: Props, currentState: State) {
    const { storedMemo } = props;
    const { memo } = currentState;
    if (storedMemo && !memo) {
      return { memo: u8aToString(storedMemo) };
    }
    return null;
  }

  state: State = {
    memo: ''
  };

  render () {
    const { memo } = this.state;
    return (
      <TextArea
        rows={3}
        autoHeight={true}
        label='Memo (supports Markdown):'
        placeholder='Here you can type any public information relevant to your account.'
        value={memo}
        onChange={this.onChange}
      />
    );
  }

  private onChange = (memo: string) => {
    const { maxLen, onChange } = this.props;
    if (maxLen && nonEmptyStr(memo)) {
      memo = memo.substring(0, maxLen.toNumber());
    }
    this.setState({ memo });
    if (onChange) {
      onChange(memo);
    }
  }
}

// inject the actual API calls automatically into props
export default withCalls<Props>(
  ['query.memo.maxMemoLength', { propName: 'maxLen' }],
  ['query.memo.memo', { paramName: 'accountId', propName: 'storedMemo' }]
)(Component);
