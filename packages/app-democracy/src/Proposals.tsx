// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Tuple } from '@polkadot/types/codec';
import { withCall, withMulti } from '@polkadot/ui-api/index';

import Proposal from './Proposal';
import translate from './translate';

type Props = I18nProps & {
  democracy_publicProps?: Array<Tuple>
};

class Proposals extends React.PureComponent<Props> {
  render () {
    const { t } = this.props;

    return (
      <section className='democracy--Proposals'>
        <h1>{t('proposals')}</h1>
        {this.renderProposals()}
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
}

export default withMulti(
  Proposals,
  translate,
  withCall('query.democracy.publicProps')
);
