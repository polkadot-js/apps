// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { EncodedParams } from '../../types';
import type { Props as BaseProps } from '../types';

import React from 'react';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import Extrinsic from '../../Extrinsic';
import translate from '../../translate';

type Props = BaseProps & I18nProps;

class Proposal extends React.PureComponent<Props> {
  extrinsic: rxjs$BehaviorSubject<EncodedParams>;

  constructor (props: Props) {
    super(props);

    this.extrinsic = new BehaviorSubject(({ isValid: false }: $Shape<EncodedParams>));
  }

  componentWillMount () {
    this.extrinsic.subscribe(({ data, isValid }: EncodedParams) =>
      this.props.subject.next({
        isValid,
        value: data
      })
    );
  }

  componentWillUnmount () {
    // FIXME: unsubscribe
  }

  render (): React$Node {
    const { isError, label, t } = this.props;

    return (
      <Extrinsic
        isError={isError}
        isPrivate
        labelMethod={t('proposal.method', {
          defaultValue: '{{label}} (extrinsic)',
          replace: {
            label
          }
        })}
        labelSection={t('proposal.method', {
          defaultValue: '{{label}} (section)',
          replace: {
            label
          }
        })}
        subject={this.extrinsic}
      />
    );
  }
}

export default translate(Proposal);
