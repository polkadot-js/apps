// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ValidatorPrefs } from '@polkadot/types';

import React from 'react';

import SetSessionKey from './SetSessionKey';
import translate from '../../translate';
import Validating from './Validating';

type Props = I18nProps & {
  accountId: string,
  hasSessionId: boolean,
  isOpen: boolean,
  onClose: () => void,
  stashId: string,
  validatorPrefs: ValidatorPrefs
};

type State = {
  sessionError: string | null,
  sessionId: string,
  sessionKeySelection: boolean,
  validatorPrefsSelection: boolean
};

class StartValidating extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      sessionError: null,
      sessionId: props.accountId,
      sessionKeySelection: props.hasSessionId ? false : true,
      validatorPrefsSelection: props.hasSessionId ? true : false
    };
  }

  render () {
    const { isOpen } = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <>
        {this.renderSessionKeySelection()}
        {this.renderValidatorPrefsSelection()}
      </>
    );
  }

  private renderSessionKeySelection () {
    const { accountId, onClose, stashId } = this.props;
    const { sessionKeySelection } = this.state;

    if (!sessionKeySelection) {
      return null;
    }

    return (
      <SetSessionKey
        accountId={accountId}
        onClose={onClose}
        onSuccess={this.goToValidationPrefsSelection}
        stashId={stashId}
      />
    );
  }

  private renderValidatorPrefsSelection () {
    const { accountId, onClose, stashId, validatorPrefs } = this.props;
    const { validatorPrefsSelection } = this.state;

    if (!validatorPrefsSelection) {
      return null;
    }

    return (
      <Validating
        accountId={accountId}
        onClose={onClose}
        stashId={stashId}
        validatorPrefs={validatorPrefs}
      />
    );
  }

  private goToValidationPrefsSelection = () => {
    this.setState({ sessionKeySelection: false, validatorPrefsSelection: true });
  }

}

export default translate(StartValidating);
