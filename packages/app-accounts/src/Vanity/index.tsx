// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps, StringOrNull, WithSubmittableButtonProps } from '@polkadot/react-components/types';
import { KeypairType } from '@polkadot/util-crypto/types';
import { GeneratorMatches, GeneratorMatch, GeneratorResult } from '../vanitygen/types';
import { ComponentProps } from '../types';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Dropdown, Input, withSubmittableButton } from '@polkadot/react-components';
import uiSettings from '@polkadot/ui-settings';

import CreateModal from '../modals/Create';
import generator from '../vanitygen';
import matchRegex from '../vanitygen/regex';
import generatorSort from '../vanitygen/sort';
import Match from './Match';
import translate from './translate';

interface Props extends ComponentProps, I18nProps, WithSubmittableButtonProps {}

const DEFAULT_MATCH = 'Some';
const BOOL_OPTIONS = [
  { text: 'No', value: false },
  { text: 'Yes', value: true }
];

let _isActive: boolean = false;
let _results: GeneratorResult[] = [];

function VanityApp ({ className, onStatusChange, submitButtonRef, onTextEnterKey, t }: Props): React.ReactElement<Props> {
  const [createSeed, setCreateSeed] = useState<StringOrNull>(null);
  const [elapsed, setElapsed] = useState(0);
  const [[match, isMatchValid], setMatch] = useState<[string, boolean]>([DEFAULT_MATCH, true]);
  const [isRunning, setIsRunning] = useState(false);
  const [[keyCount, keyTime], setKeyStats] = useState<[number, number]>([0, 0]);
  const [matches, setMatches] = useState<GeneratorMatches>([]);
  const [startAt, setStartAt] = useState(0);
  const [type, setType] = useState<KeypairType>('ed25519');
  const [withCase, setWithCase] = useState(true);
  const [withHex] = useState(true);

  const _onStartOrStop = (): void => {
    setIsRunning(!isRunning);
  }

  const _onChangeMatch = (match: string): void => {
    setMatch([
      match,
      matchRegex.test(match) &&
        (match.length !== 0) &&
        (match.length < 31)
    ]);
  }

  const _onChangeCase = (withCase: boolean): void => {
    setWithCase(withCase);
  }

  const _onChangeType = (type: KeypairType): void => {
    setType(type);
  }

  const _onToggleCreate = (createSeed: StringOrNull): void => {
    setCreateSeed(createSeed);
  }

  const _onCloseCreate = (): void => {
    setCreateSeed(null);
  }

  const _checkMatches = (): void => {
    const resultsCopy = _results;

    _results = [];

    if (resultsCopy.length === 0 || !_isActive) {
      return;
    }

    let newKeyCount = keyCount;
    let newKeyTime = keyTime;
    const newMatches = resultsCopy
      .reduce((result, { elapsed, found }): GeneratorMatch[] => {
        newKeyCount += found.length;
        newKeyTime += elapsed;

        return result.concat(found);
      }, matches)
      .sort(generatorSort)
      .slice(0, 25);

    setKeyStats([newKeyCount, newKeyTime]);
    setMatches(newMatches);
    setElapsed(Date.now() - startAt);
  }

  const _executeGeneration = (): void => {
    if (!isRunning) {
      _checkMatches();

      return;
    }

    setImmediate((): void => {
      if (_isActive) {
        if (_results.length === 25) {
          _checkMatches();
        }

        _results.push(
          generator({
            match,
            runs: 10,
            type,
            withCase,
            withHex
          })
        );

        _executeGeneration();
      }
    });
  }

  const _onRemoveMatch = (address: string): void => {
    setMatches(
      matches.filter((item): boolean =>
        item.address !== address
      )
    );
  }

  useEffect((): void => {
    _isActive = !isRunning;

    _isActive && (() => {
      setKeyStats([0, 0]);
      setStartAt(Date.now());
    });

    _executeGeneration();
  }, [isRunning])

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
          onChange={_onChangeMatch}
          onEnter={onTextEnterKey}
          value={match}
        />
        <Dropdown
          className='medium'
          help={t('Should the search be case sensitive, e.g if you select "no" your search for "Some" may return addresses containing "somE" or "sOme"...')}
          isDisabled={isRunning}
          label={t('case sensitive')}
          options={BOOL_OPTIONS}
          onChange={_onChangeCase}
          value={withCase}
        />
      </div>
      <div className='ui--row'>
        <Dropdown
          className='medium'
          defaultValue={type}
          help={t('Determines what cryptography will be used to create this account. Note that to validate on Polkadot, the session account must use "ed25519".')}
          label={t('keypair crypto type')}
          onChange={_onChangeType}
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
          isPrimary={!isRunning}
          onClick={_onStartOrStop}
          label={
            isRunning
              ? t('Stop generation')
              : t('Start generation')
          }
          ref={submitButtonRef}
        />
      </Button.Group>
      {keyCount && (
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
            onToggleCreate={_onToggleCreate}
            onRemove={_onRemoveMatch}
          />
        ))}
      </div>
      {createSeed && (
        <CreateModal
          onClose={_onCloseCreate}
          onStatusChange={onStatusChange}
          seed={createSeed}
          type={type}
        />
      )}
    </div>
  );
}

// class VanityApp2 extends <Props, State> {
//   private results: GeneratorResult[] = [];

//   public state: State = {
//     createSeed: null,
//     elapsed: 0,
//     isMatchValid: true,
//     isRunning: false,
//     keyCount: 0,
//     keyTime: 0,
//     match: DEFAULT_MATCH,
//     matches: [],
//     startAt: 0,
//     type: 'ed25519',
//     withCase: true,
//     withHex: true
//   };

//   private _isActive = false;

//   public componentWillUnmount (): void {
//     this._isActive = false;
//   }

//   public render (): React.ReactNode {
//     const { className, onStatusChange } = this.props;
//     const { createSeed, type } = this.state;

//     return (
//       <div className={className}>
//         {this.renderOptions()}
//         {this.renderButtons()}
//         {this.renderStats()}
//         {this.renderMatches()}
//         {createSeed && (
//           <CreateModal
//             onClose={this.closeCreate}
//             onStatusChange={onStatusChange}
//             seed={createSeed}
//             type={type}
//           />
//         )}
//       </div>
//     );
//   }

//   private renderButtons (): React.ReactNode {
//     const { t } = this.props;
//     const { isMatchValid, isRunning } = this.state;

//     return (
//       <Button.Group>
//         <Button
//           icon={
//             isRunning
//               ? 'stop'
//               : 'sign-in'
//           }
//           isDisabled={!isMatchValid}
//           isPrimary={!isRunning}
//           onClick={this.toggleStart}
//           label={
//             isRunning
//               ? t('Stop generation')
//               : t('Start generation')
//           }
//           ref={this.button}
//         />
//       </Button.Group>
//     );
//   }

//   private renderMatches (): React.ReactNode {
//     const { matches } = this.state;

//     return (
//       <div className='vanity--App-matches'>
//         {matches.map((match): React.ReactNode => (
//           <Match
//             {...match}
//             key={match.address}
//             onCreateToggle={this.onCreateToggle}
//             onRemove={this.onRemove}
//           />
//         ))}
//       </div>
//     );
//   }

//   private renderOptions (): React.ReactNode {
//     const { t } = this.props;
//     const { isMatchValid, isRunning, match, type, withCase } = this.state;

//     return (
//       <>
//         <div className='ui--row'>
//           <Input
//             autoFocus
//             className='medium'
//             help={t('Type here what you would like your address to contain. This tool will generate the keys and show the associated addresses that best match your search. You can use "?" as a wildcard for a character.')}
//             isDisabled={isRunning}
//             isError={!isMatchValid}
//             label={t('Search for')}
//             onChange={this.onChangeMatch}
//             onEnter={this.submit}
//             value={match}
//           />
//           <Dropdown
//             className='medium'
//             help={t('Should the search be case sensitive, e.g if you select "no" your search for "Some" may return addresses containing "somE" or "sOme"...')}
//             isDisabled={isRunning}
//             label={t('case sensitive')}
//             options={BOOL_OPTIONS}
//             onChange={this.onChangeCase}
//             value={withCase}
//           />
//         </div>
//         <div className='ui--row'>
//           <Dropdown
//             className='medium'
//             defaultValue={type}
//             help={t('Determines what cryptography will be used to create this account. Note that to validate on Polkadot, the session account must use "ed25519".')}
//             label={t('keypair crypto type')}
//             onChange={this.onChangeType}
//             options={uiSettings.availableCryptos}
//           />
//         </div>
//       </>
//     );
//   }

//   private renderStats (): React.ReactNode {
//     const { t } = this.props;
//     const { elapsed, keyCount } = this.state;

//     if (!keyCount) {
//       return null;
//     }

//     const secs = elapsed / 1000;

//     return (
//       <div className='vanity--App-stats'>
//         {t('Evaluated {{count}} keys in {{elapsed}}s ({{avg}} keys/s)', {
//           replace: {
//             avg: (keyCount / secs).toFixed(3),
//             count: keyCount,
//             elapsed: secs.toFixed(2)
//           }
//         })}
//       </div>
//     );
//   }

//   private checkMatches (): void {
//     const results = this.results;

//     this.results = [];

//     if (results.length === 0 || !this._isActive) {
//       return;
//     }

//     this.setState(
//       ({ keyCount, keyTime, matches, startAt }: State): Pick<State, never> => {
//         let newKeyCount = keyCount;
//         let newKeyTime = keyTime;
//         const newMatches = results
//           .reduce((result, { elapsed, found }): GeneratorMatch[] => {
//             newKeyCount += found.length;
//             newKeyTime += elapsed;

//             return result.concat(found);
//           }, matches)
//           .sort(generatorSort)
//           .slice(0, 25);
//         const elapsed = Date.now() - startAt;

//         return {
//           elapsed,
//           matches: newMatches,
//           keyCount: newKeyCount,
//           keyTime: newKeyTime
//         };
//       }
//     );
//   }

//   private executeGeneration = (): void => {
//     if (!this.state.isRunning) {
//       this.checkMatches();

//       return;
//     }

//     setImmediate((): void => {
//       if (this._isActive) {
//         if (this.results.length === 25) {
//           this.checkMatches();
//         }

//         const { match, type, withCase, withHex } = this.state;

//         this.results.push(
//           generator({
//             match,
//             runs: 10,
//             type,
//             withCase,
//             withHex
//           })
//         );

//         this.executeGeneration();
//       }
//     });
//   }

//   private onCreateToggle = (createSeed: string): void => {
//     this.setState({ createSeed });
//   }

//   private onChangeCase = (withCase: boolean): void => {
//     this.setState({ withCase });
//   }

//   private onChangeMatch = (match: string): void => {
//     this.setState({
//       isMatchValid:
//         matchRegex.test(match) &&
//         (match.length !== 0) &&
//         (match.length < 31),
//       match
//     });
//   }

//   private onChangeType = (type: KeypairType): void => {
//     this.setState({ type });
//   }

//   private onRemove = (address: string): void => {
//     this.setState(
//       ({ matches }: State): Pick<State, never> => ({
//         matches: matches.filter((item): boolean =>
//           item.address !== address
//         )
//       })
//     );
//   }

//   private toggleStart = (): void => {
//     this.setState(
//       ({ isRunning, keyCount, keyTime, startAt }: State): Pick<State, never> => {
//         this._isActive = !isRunning;

//         return {
//           isRunning: this._isActive,
//           keyCount: this._isActive ? 0 : keyCount,
//           keyTime: this._isActive ? 0 : keyTime,
//           startAt: this._isActive ? Date.now() : startAt
//         };
//       },
//       this.executeGeneration
//     );
//   }

//   private closeCreate = (): void => {
//     this.setState({ createSeed: null });
//   }
// }

export default withSubmittableButton(translate(
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
));
