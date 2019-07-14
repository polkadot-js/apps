// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { Proposal } from '@polkadot/types';
import { withCalls, withMulti } from '@polkadot/ui-api';
import { Column } from '@polkadot/ui-app';

import ProposalDisplay from './Proposal';
import translate from '../translate';

interface Props extends I18nProps {
  democracy_publicProps?: [BN, Proposal][];
}

interface State {
  isProposeOpen: boolean;
}

class Proposals extends React.PureComponent<Props> {
  public state: State = {
    isProposeOpen: false
  };

  public render (): React.ReactNode {
    const { t } = this.props;

    return (
      <Column
        emptyText={t('No available proposals')}
        headerText={t('proposals')}
      >
        {this.renderProposals()}
      </Column>
    );
  }

  private renderProposals () {
    const { democracy_publicProps = [] } = this.props;

    return democracy_publicProps.map(([idNumber, proposal]) => (
      <ProposalDisplay
        idNumber={idNumber}
        key={idNumber.toString()}
        value={proposal}
      />
    ));
  }
}

export default withMulti(
  Proposals,
  translate,
  withCalls<Props>('query.democracy.publicProps')
);
