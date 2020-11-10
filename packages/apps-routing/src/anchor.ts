import { Route } from './types';
import Component from '@polkadot/app-anchor';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: []
    },
    group: 'developer',
    icon: 'anchor',
    name: 'anchor',
    text: t<string>('nav.anchor', 'Anchor', { ns: 'apps-routing' })
  };
}
