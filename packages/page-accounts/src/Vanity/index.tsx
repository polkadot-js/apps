// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { KeypairType } from '@polkadot/util-crypto/types';
import { GeneratorMatches, GeneratorMatch, GeneratorResult } from '@polkadot/vanitygen/types';
import { ComponentProps } from '../types';

import React from 'react';
import styled from 'styled-components';
import { Button, Dropdown, Input, TxComponent } from '@polkadot/react-components';
import uiSettings from '@polkadot/ui-settings';
import generator from '@polkadot/vanitygen/generator';
import matchRegex from '@polkadot/vanitygen/regex';
import generatorSort from '@polkadot/vanitygen/sort';

import CreateModal from '../Accounts/modals/Create';
import translate from '../translate';
import Match from './Match';

interface Props extends ComponentProps, I18nProps {}

interface State {
  createSeed: string | null;
  elapsed: number;
  isMatchValid: boolean;
  isRunning: boolean;
  keyCount: 0;
  keyTime: 0;
  match: string;
  matches: GeneratorMatches;
  startAt: number;
  type: KeypairType;
  withCase: boolean;
  withHex: boolean;
}

const DEFAULT_MATCH = 'Some';
const BOOL_OPTIONS = [
  { text: 'No', value: false },
  { text: 'Yes', value: true }
];

class VanityApp extends TxComponent<Props, State> {
  private results: GeneratorResult[] = [];

  public state: State = {
    createSeed: null,
    elapsed: 0,
    isMatchValid: true,
    isRunning: false,
    keyCount: 0,
    keyTime: 0,
    match: DEFAULT_MATCH,
    matches: [],
    startAt: 0,
    type: 'ed25519',
    withCase: true,
    withHex: true
  };

  private _isActive = false;

  public componentWillUnmount (): void {
    this._isActive = false;
  }

  public render (): React.ReactNode {
    const { className, onStatusChange, t } = this.props;
    const { createSeed, elapsed, isMatchValid, isRunning, keyCount, match, matches, type, withCase } = this.state;

    return (
      <div className={className}>
        <div className='ui--row'>
          <Input
            autoFocus
            className='medium'
            help={t('Type here what you would like your address to contain. This tool will generate the keys and show the associated addresses that best match your search. You can use "?" as a wildcard for a character.')}
            isDisabled={isRunning}
            isError={!isMatchValid}
            label={t('Search for')}
            onChange={this.onChangeMatch}
            onEnter={this.submit}
            value={match}
          />
          <Dropdown
            className='medium'
            help={t('Should the search be case sensitive, e.g if you select "no" your search for "Some" may return addresses containing "somE" or "sOme"...')}
            isDisabled={isRunning}
            label={t('case sensitive')}
            onChange={this.onChangeCase}
            options={BOOL_OPTIONS}
            value={withCase}
          />
        </div>
        <div className='ui--row'>
          <Dropdown
            className='medium'
            defaultValue={type}
            help={t('Determines what cryptography will be used to create this account. Note that to validate on Polkadot, the session account must use "ed25519".')}
            label={t('keypair crypto type')}
            onChange={this.onChangeType}
            options={uiSettings.availableCryptos}
          />
        </div>
        <Button.Group>
          <Button
            icon={
              isRunning
                ? 'stop'
                : 'sign-in'
            }
            isDisabled={!isMatchValid}
            label={
              isRunning
                ? t('Stop generation')
                : t('Start generation')
            }
            onClick={this.toggleStart}
          />
        </Button.Group>
        {keyCount !== 0 && (
          <div className='vanity--App-stats'>
            {t('Evaluated {{count}} keys in {{elapsed}}s ({{avg}} keys/s)', {
              replace: {
                avg: (keyCount / (elapsed / 1000)).toFixed(3),
                count: keyCount,
                elapsed: (elapsed / 1000).toFixed(2)
              }
            })}
          </div>
        )}
        <div className='vanity--App-matches'>
          {matches.map((match): React.ReactNode => (
            <Match
              {...match}
              key={match.address}
              onCreateToggle={this.onCreateToggle}
              onRemove={this.onRemove}
            />
          ))}
        </div>
        {createSeed && (
          <CreateModal
            onClose={this.closeCreate}
            onStatusChange={onStatusChange}
            seed={createSeed}
            type={type}
          />
        )}
      </div>
    );
  }

  private checkMatches (): void {
    const results = this.results;

    this.results = [];

    if (results.length === 0 || !this._isActive) {
      return;
    }

    this.setState(
      ({ keyCount, keyTime, matches, startAt }: State): Pick<State, never> => {
        let newKeyCount = keyCount;
        let newKeyTime = keyTime;
        const newMatches = results
          .reduce((result, { elapsed, found }): GeneratorMatch[] => {
            newKeyCount += found.length;
            newKeyTime += elapsed;

            return result.concat(found);
          }, matches)
          .sort(generatorSort)
          .slice(0, 25);
        const elapsed = Date.now() - startAt;

        return {
          elapsed,
          keyCount: newKeyCount,
          keyTime: newKeyTime,
          matches: newMatches
        };
      }
    );
  }

  private executeGeneration = (): void => {
    if (!this.state.isRunning) {
      this.checkMatches();

      return;
    }

    setImmediate((): void => {
      if (this._isActive) {
        if (this.results.length === 25) {
          this.checkMatches();
        }

        const { match, type, withCase, withHex } = this.state;

        this.results.push(
          generator({
            match,
            runs: 10,
            type,
            withCase,
            withHex
          })
        );

        this.executeGeneration();
      }
    });
  }

  private onCreateToggle = (createSeed: string): void => {
    this.setState({ createSeed });
  }

  private onChangeCase = (withCase: boolean): void => {
    this.setState({ withCase });
  }

  private onChangeMatch = (match: string): void => {
    this.setState({
      isMatchValid:
        matchRegex.test(match) &&
        (match.length !== 0) &&
        (match.length < 31),
      match
    });
  }

  private onChangeType = (type: KeypairType): void => {
    this.setState({ type });
  }

  private onRemove = (address: string): void => {
    this.setState(
      ({ matches }: State): Pick<State, never> => ({
        matches: matches.filter((item): boolean =>
          item.address !== address
        )
      })
    );
  }

  private toggleStart = (): void => {
    this.setState(
      ({ isRunning, keyCount, keyTime, startAt }: State): Pick<State, never> => {
        this._isActive = !isRunning;

        return {
          isRunning: this._isActive,
          keyCount: this._isActive ? 0 : keyCount,
          keyTime: this._isActive ? 0 : keyTime,
          startAt: this._isActive ? Date.now() : startAt
        };
      },
      this.executeGeneration
    );
  }

  private closeCreate = (): void => {
    this.setState({ createSeed: null });
  }
}

export default translate(
  styled(VanityApp)`
    .vanity--App-matches {
      padding: 1em 0;
    }

    .vanity--App-stats {
      padding: 1em 0 0 0;
      opacity: 0.45;
      text-align: center;
    }
  `
);
