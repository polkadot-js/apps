import React from 'react';
import { Form } from 'semantic-ui-react';
import { History } from 'history';

import MemoView from '@polkadot/joy-utils/memo/MemoView';
import { RouteComponentProps } from 'react-router';

type Props = RouteComponentProps & {
  history: History,
  match: {
    params: {
      accountId?: string
    }
  }
};

type State = {
  loaded: boolean,
  accountInput?: string
};

export default class Component extends React.PureComponent<Props, State> {

  static getDerivedStateFromProps (props: Props, currentState: State): State | null {
    const { match: { params: { accountId } } } = props;
    const { loaded } = currentState;
    // console.log('getDerivedStateFromProps', props);
    if (!loaded && accountId) {
      return { loaded: true, accountInput: accountId };
    }
    return null;
  }

  state: State = {
    loaded: false,
    accountInput: ''
  };

  render () {
    const { match: { params: { accountId } } } = this.props;
    const { accountInput } = this.state;
    return <>
      <Form onSubmit={this.findMemo}>
        <Form.Input
          value={accountInput}
          placeholder='Key address'
          onChange={e => this.onChangeAccount(e.target.value)}
          action={{ icon: 'search', content: 'Find memo', onClick: this.findMemo }}
        />
      </Form>
      {accountId && <MemoView accountId={accountId} preview={false} style={{ marginTop: '1rem' }} />}
    </>;
  }

  private onChangeAccount = (accountInput: string): void => {
    this.setState({ accountInput });
  }

  private findMemo = () => {
    // console.log('findMemo', this.props);
    this.props.history.push('/addresses/memo/' + this.state.accountInput);
  }
}
