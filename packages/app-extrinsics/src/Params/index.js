// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { RawParam } from '../types';

import './Params.css';

import React from 'react';

import translate from '../translate';
import findComponent from './findComponent';
import createSubjects from './subjects';
import typeToText from './typeToText';

type Props = I18nProps & {
  subject: rxjs$BehaviorSubject<Array<RawParam>>,
  value: Extrinsic;
};

type State = {
  subjects: Array<rxjs$BehaviorSubject<RawParam>>,
  subscriptions: Array<rxjs$ISubscription>
};

class Params extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      subjects: [],
      subscriptions: []
    };
  }

  static getDerivedStateFromProps (props: Props, prevState: State): $Shape<State> | null {
    if (!props.value || Object.keys(props.value.params || {}).length === 0) {
      // TODO unsubscribe

      return {
        subjects: [],
        subscriptions: []
      };
    }

    const subjects = createSubjects(props.value.params, props.subject);
    let subscriptions;

    if (props.subject) {
      const onChange = (): void => {
        props.subject.next(
          subjects.map((s) => s.getValue())
        );
      };

      subscriptions = subjects.map((s) => s.subscribe(onChange));
    }

    return {
      subjects,
      subscriptions
    };
  }

  componentWillUnmount () {
    // FIXME unsubscribe
  }

  render (): React$Node {
    const { className, style, value } = this.props;
    const { subjects } = this.state;

    if (!value || !subjects.length) {
      return null;
    }

    const { name, params } = value;
    const paramNames = Object.keys(params || {});

    if (paramNames.length === 0) {
      return null;
    }

    return (
      <div
        className={['extrinsics--Params', 'ui--form', className].join(' ')}
        style={style}
      >
        <div className='extrinsics--Params-Content'>
          {paramNames.map((paramName, index) => {
            const param = params[paramName];
            const Component = findComponent(param.type);

            return (
              <Component
                className='extrinsics--Param'
                key={`${name}:${paramName}:${index}`}
                label={`${paramName}: ${typeToText(param.type)}`}
                subject={subjects[index]}
                value={param}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default translate(Params);
