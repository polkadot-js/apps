// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { I18nProps } from '../types';
import type { ComponentMap, RawParam } from './types';

require('./Params.css');

const React = require('react');

const translate = require('../translate');
const findComponent = require('./findComponent');
const createSubjects = require('./subjects');
const typeToText = require('./typeToText');

type Props = I18nProps & {
  components?: ComponentMap,
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

  static unsubscribe (subscriptions: Array<rxjs$ISubscription>): void {
    subscriptions.forEach((s) =>
      s.unsubscribe()
    );
  }

  static getDerivedStateFromProps (props: Props, prevState: State): $Shape<State> | null {
    if (!props.value || Object.keys(props.value.params || {}).length === 0) {
      Params.unsubscribe(prevState.subscriptions);

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
    Params.unsubscribe(this.state.subscriptions);
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
        className={['ui--Params', 'ui--form', className].join(' ')}
        style={style}
      >
        <div className='ui--Params-Content'>
          {[].concat.apply(
            null, paramNames.map((paramName, index) => {
              const param = params[paramName];
              const Component = findComponent(param.type, this.props.components);
              const components = Array.isArray(Component)
                ? Component
                : [Component];

              return components.map((Component, cindex) => (
                <Component
                  className='ui--Param'
                  key={`${name}:${paramName}:${index}:${cindex}`}
                  label={`${paramName}: ${typeToText(param.type)}`}
                  subject={subjects[index]}
                  value={param}
                />
              ));
            })
          )}
        </div>
      </div>
    );
  }
}

module.exports = translate(Params);
