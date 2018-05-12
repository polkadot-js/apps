// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';
import type { Generator$Matches, Generator$Result } from './generator/types';

import './index.css';

import React from 'react';

import Button from '@polkadot/ui-app/src/Button';
import Dropdown from '@polkadot/ui-app/src/Dropdown';
import Input from '@polkadot/ui-app/src/Input';
import Labelled from '@polkadot/ui-app/src/Labelled';

import Match from './Match';
import generator from './generator';
import matchRegex from './generator/regex';
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

const DEFAULT_MATCH = 'Some';
const BOOL_OPTIONS = [
  { text: 'No', value: false },
  { text: 'Yes', value: true }
];

class App extends React.PureComponent<Props, State> {
  results: Array<Generator$Result> = [];
  state: State = {
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

  render (): React$Node {
    const { className, style, t } = this.props;
    const { elapsed, isMatchValid, isRunning, match, matches, keyCount, withCase } = this.state;

    return (
      <div
        className={['vanity--App', className].join(' ')}
        style={style}
      >
        <div className='ui--row'>
          <Input
            className='medium'
            isDisable={isRunning}
            isError={!isMatchValid}
            label={t('vanity.matching', {
              defaultValue: 'generate address containing (? wildcard)'
            })}
            onChange={this.onChangeMatch}
            value={match}
          />
          <Dropdown
            className='small'
            label={t('vanity.case', {
              defaultValue: 'case sensitive match'
            })}
            options={BOOL_OPTIONS}
            onChange={this.onChangeCase}
            value={withCase}
          />
          <Labelled
            className='small'
            label={t('vanity.offset', {
              defaultValue: 'exact offset'
            })}
          >
            <div className='ui dropdown selection disabled'>
              {t('vanity.offset.off', {
                defaultValue: 'No'
              })}
            </div>
          </Labelled>
        </div>
        <Button.Group>
          <Button
            isDisabled={!isMatchValid}
            isPrimary={!isRunning}
            onClick={this.toggleStart}
            text={
              isRunning
                ? t('vanity.stop', { defaultValue: 'Stop generation' })
                : t('vanity.start', { defaultValue: 'Start generation' })
            }
          />
        </Button.Group>
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

  onChangeCase = (withCase: boolean): void => {
    this.setState({ withCase });
  }

  onChangeMatch = (match: string): void => {
    this.setState({
      isMatchValid:
        matchRegex.test(match) &&
        (match.length !== 0) &&
        (match.length < 31),
      match
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
