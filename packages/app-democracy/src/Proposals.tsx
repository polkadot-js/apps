// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Tuple } from '@polkadot/types';
import { Button } from '@polkadot/ui-app';
import { withCalls, withMulti } from '@polkadot/ui-api';

import Proposal from './Proposal';
import Propose from './Propose';
import translate from './translate';

type Props = I18nProps & {
  democracy_publicProps?: Array<Tuple>
};

type State = {
  isProposeOpen: boolean
};

class Proposals extends React.PureComponent<Props> {
  state: State = {
    isProposeOpen: false
  };

  render () {
    const { t } = this.props;

    return (
      <section className='democracy--Proposals'>
        <h1>
          {t('proposals')}
          <Button
            isPrimary
            className='democracy--Proposal-new'
            key='propose'
            onClick={this.togglePropose}
            label={t('Propose')}
          />
        </h1>
        {this.renderProposals()}
        {this.renderPropose()}
      </section>
    );
  }

  private renderProposals () {
    const { democracy_publicProps, t } = this.props;

    if (!democracy_publicProps || !democracy_publicProps.length) {
      return (
        <div className='ui disabled'>
          {t('no available proposals')}
        </div>
      );
    }

    return democracy_publicProps.map((proposal) => (
      <Proposal
        idNumber={proposal[0]}
        key={proposal[0].toString()}
        value={proposal}
      />
    ));
  }

  private renderPropose () {
    const { isProposeOpen } = this.state;

    return (
      <Propose
        isOpen={isProposeOpen}
        onClose={this.togglePropose}
      />
    );
  }

  private togglePropose = () => {
    this.setState(({ isProposeOpen }: State) => ({
      isProposeOpen: !isProposeOpen
    }));
  }
}

export default withMulti(
  Proposals,
  translate,
  withCalls<Props>('query.democracy.publicProps')
);
