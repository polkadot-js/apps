// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { Generator$Matches, Generator$Result } from './generator/types';

import './index.css';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import Input from 'semantic-ui-react/dist/es/elements/Input';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import Dropdown from 'semantic-ui-react/dist/es/modules/Dropdown';

import Match from './Match';
import generator from './generator';
import generatorSort from './generator/sort';
import translate from './translate';

type Props = I18nProps & {};

type State = {
  elapsed: number,
  isMatchValid: boolean,
  isRunning: boolean,
  keyCount: 0,
  keyTime: 0,
  match: string,
  matches: Generator$Matches,
  startAt: number,
  withCase: boolean
}

const DEFAULT_MATCH = 'Some?';
const MATCH_REGEX = /[1-9A-Za-z?]*$/;
const BOOL_OPTIONS = [
  { text: 'No', value: false },
  { text: 'Yes', value: true }
];

class App extends React.PureComponent<Props, State> {
  results: Array<Generator$Result>;
  state: State;

  constructor (props: Props) {
    super(props);

    this.results = [];
    this.state = {
      elapsed: 0,
      isMatchValid: true,
      isRunning: false,
      keyCount: 0,
      keyTime: 0,
      match: DEFAULT_MATCH,
      matches: [],
      startAt: 0,
      withCase: true
    };
  }

  render (): React$Node {
    const { className, style, t } = this.props;
    const { elapsed, isMatchValid, isRunning, match, matches, keyCount, withCase } = this.state;

    return (
      <div
        className={['vanity--App', className].join(' ')}
        style={style}
      >
        <div className='ui--form'>
          <div className='medium'>
            <Label>{t('vanity.matching', {
              defaultValue: 'generate address containing (? wildcard)'
            })}</Label>
            <Input
              disabled={isRunning}
              error={!isMatchValid}
              onChange={this.onChangeMatch}
              value={match}
            />
          </div>
          <div className='small'>
            <Label>{t('vanity.case', {
              defaultValue: 'case sensitive match'
            })}</Label>
            <Dropdown
              selection
              options={BOOL_OPTIONS}
              onChange={this.onChangeCase}
              value={withCase}
            />
          </div>
          <div className='small'>
            <Label>{t('vanity.offset', {
              defaultValue: 'exact offset'
            })}</Label>
            <div className='ui dropdown selection disabled'>
              {t('vanity.offset.off', {
                defaultValue: 'No'
              })}
            </div>
          </div>
        </div>
        <div className='ui--form-buttons'>
          <Button
            disabled={!isMatchValid}
            negative={isRunning}
            primary
            onClick={this.toggleStart}
          >
            {
              isRunning
                ? t('vanity.stop', { defaultValue: 'Stop' })
                : t('vanity.start', { defaultValue: 'Start' })
            }
          </Button>
        </div>
        {
          keyCount
            ? (
              <div className='vanity--App-stats'>
                {t('vanity.stats', {
                  defaultValue: 'Evaluated {{count}} keys in {{elapsed}}s ({{avg}}ms/key)',
                  replace: {
                    avg: (elapsed / keyCount).toFixed(3),
                    count: keyCount,
                    elapsed: (elapsed / 1000).toFixed(2)
                  }
                })}
              </div>
            )
            : null
        }
        <div className='vanity--App-matches'>
          {matches.map((match) => (
            <Match
              {...match}
              key={match.address}
              onRemove={this.onRemove}
            />
          ))}
        </div>
      </div>
    );
  }

  checkMatches (): void {
    const results = this.results;

    this.results = [];

    if (results.length === 0) {
      return;
    }

    this.setState(
      (prevState: State) => {
        let newKeyCount = prevState.keyCount;
        let newKeyTime = prevState.keyTime;

        const matches = results
          .reduce((result, { elapsed, found }) => {
            newKeyCount += found.length;
            newKeyTime += elapsed;

            return result.concat(found);
          }, prevState.matches)
          .sort(generatorSort)
          .slice(0, 25);
        const elapsed = Date.now() - prevState.startAt;

        return {
          elapsed,
          matches,
          keyCount: newKeyCount,
          keyTime: newKeyTime
        };
      }
    );
  }

  executeGeneration = (): void => {
    if (!this.state.isRunning) {
      this.checkMatches();

      return;
    }

    setTimeout(() => {
      if (this.results.length === 5) {
        this.checkMatches();
      }

      this.results.push(
        generator({
          match: this.state.match,
          runs: 10,
          withCase: this.state.withCase
        })
      );

      this.executeGeneration();
    }, 0);
  }

  // eslint-disable-next-line no-unused-vars
  onChangeCase = (event: SyntheticEvent<*>, { value }): void => {
    this.setState({
      withCase: value
    });
  }

  // eslint-disable-next-line no-unused-vars
  onChangeMatch = (event: SyntheticEvent<*>, { value }): void => {
    const isMatchValid = MATCH_REGEX.test(value) && value.length < 31;

    this.setState({
      isMatchValid,
      match: value
    });
  }

  onRemove = (address: string): void => {
    this.setState(
      (prevState: State) => ({
        matches: prevState.matches.filter((item) =>
          item.address !== address
        )
      })
    );
  }

  toggleStart = (): void => {
    this.setState(
      (prevState: State) => {
        const { isRunning, keyCount, keyTime, startAt } = prevState;

        return {
          isRunning: !isRunning,
          keyCount: !isRunning ? 0 : keyCount,
          keyTime: !isRunning ? 0 : keyTime,
          startAt: !isRunning ? Date.now() : startAt
        };
      },
      this.executeGeneration
    );
  }
}

export default translate(App);
