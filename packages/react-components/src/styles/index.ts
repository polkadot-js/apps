// Copyright 2017-2021 @polkadot/react-components authors & contributors
// and @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createGlobalStyle } from 'styled-components';

import cssComponents from './components';
import { ELEV_3_CSS } from './constants';
import cssForm from './form';
import cssMedia from './media';
import cssRx from './rx';
import cssSemantic from './semantic';
import cssTheme from './theme';

interface Props {
  uiHighlight?: string;
}

const defaultHighlight = '#2477B3'; // #999

const getHighlight = (props: Props): string =>
  (props.uiHighlight || defaultHighlight);

export default createGlobalStyle<Props>`
  .ui--highlight--all {
    background: ${getHighlight} !important;
    border-color: ${getHighlight} !important;
    color: ${getHighlight} !important;
  }

  .ui--highlight--bg {
    background: ${getHighlight} !important;
  }

  .ui--highlight--border {
    /* .theme--default .ui.menu.tabular > .item.active */
    border-color: ${getHighlight} !important;
  }

  .ui--highlight--color {
    color: ${getHighlight} !important;
  }

  .ui--highlight--fill {
    fill: ${getHighlight} !important;
  }

  .ui--highlight--gradient {
    background: ${(props: Props): string => `linear-gradient(90deg, ${props.uiHighlight || defaultHighlight}, transparent)`};
  }

  .ui--highlight--icon {
    .svg-inline--fa {
      color: ${getHighlight} !important;
    }
  }

  .ui--highlight--spinner {
    &:after {
      border-color: ${getHighlight} transparent transparent !important;
    }
  }

  .ui--highlight--stroke {
    stroke: ${getHighlight} !important;
  }

  // .theme--default {
  //   .ui.menu.tabular .item.active {
  //     border-color: ${getHighlight} !important;
  //   }

  //   .ui.blue.progress > .bar {
  //     background-color: ${getHighlight} !important;
  //   }

  //   .ui.negative.button,
  //   .ui.buttons .negative.button {
  //     background: #FFF;
  //   }

  //   .ui.primary.button,
  //   .ui.buttons .primary.button {
  //     background: ${getHighlight};

  //     &.active,
  //     &:active,
  //     &:focus,
  //     &:hover {
  //       background-color: ${getHighlight};
  //     }
  //   }

  //   .ui.toggle.checkbox {
  //     input:checked~.box:before,
  //     input:checked~label:before {
  //       background-color: ${getHighlight} !important;
  //     }
  //   }
  // }

  html {
    font-size: 16px;
  }

  #root {
    color: var(--grey60);
    font-family: var(--default-font-family, sans-serif);
    font-size: 0.875rem;
    height: 100%;
  }

  a {
    cursor: pointer;
  }

  article {
    ${ELEV_3_CSS}
    padding: 0.9rem;
    position: relative;
    text-align: left;

    .ui.button.isIcon {
      margin-left: 0.35rem;
    }

    &:hover {
      /* box-shadow: 0 4px 8px rgba(0,0,0,0.1); */
      /* box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      border-color: transparent; */
    }

    &:not(:hover) {
      .ui.button {
        background: transparent !important;
        border-color: transparent !important;
      }

      .ui.toggle.checkbox {
        input:checked~.box:before,
        input:checked~label:before {
          background-color: #eee !important;
        }
      }

      .ui.button.show-on-hover {
        visibility: hidden;
      }
    }

    > ul {
      margin: 0;
      padding: 0;
    }

    &.error,
    &.warning {
      font-size: 0.95rem;
      margin-left: 2.25rem;
      padding: 0.75rem 1rem;
    }

    &.nomargin {
      margin-left: 0;
    }

    &.error {
      /* background: #fff6f6; */
      border-color: var(--red-secondary);
      /* color: #9f3a38; */
    }

    &.padded {
      padding: 0.75rem 1rem;

      > div {
        margin: 0.25rem;
      }
    }

    &.warning {
      background: #ffffe0;
      border-color: #eeeeae;
    }
  }

  body {
    background: var(--background);
    color: var(--grey60);
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    height: 100%;
    margin: 0;
  }

  br {
    line-height: 1.5rem;
  }

  details {
    cursor: pointer;

    &[open] > summary {
      white-space: normal;

      br, br + * {
        display: block;
      }
    }

    > summary {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      outline: none;

      br, br + * {
        display: none;
      }
    }
  }

  footer {
    margin: 2rem 0;
    padding: 2rem 0 0;
    border-top: 1px solid var(--grey20);

    > article {
      background: transparent;
    }
  }

  h1, h2, h3, h4, h5 {
    color: var(--grey80);
    font-family: var(--default-font-family, sans-serif);
    font-weight: 300;
  }

  h1 {
    font-size: 1.8rem;

    em {
      font-style: normal;
      text-transform: none;
    }
  }

  h1, h2, h3, h4, h5 {
    margin-bottom: 0.25rem;
  }

  header {
    margin: 2rem 0;
    padding: 0 0 2rem;
    border-bottom: 1px solid var(--grey20);

    > article {
      background: transparent;
    }
  }

  html {
    height: 100%;
  }

  input {
    color: var(--grey80);
  }

  input::selection, textarea::selection {
    background-color: var(--blue-primary);
  }

  label {
    box-sizing: border-box;
    color: var(--grey80);
    display: block;
    font-family: var(--default-font-family, sans-serif);
    font-size: 1rem;
    font-weight: 500;
  }

  main {
    margin: 0px auto 6rem;
    max-width: 35rem;

    section {
      > :not(:last-child) {
        margin-bottom: 2.5rem;
      }
    }

    &.isLoading {
      display: flex;
      align-items: center;
      height: 100%;
      justify-content: center;
    }
  }

  .tippy-box {
    background: transparent !important;
    margin: 0 !important;
    max-width: 640px !important;
  }

  /* Add our overrides */
  ${cssSemantic}
  ${cssTheme}
  ${cssForm}
  ${cssMedia}
  ${cssRx}
  ${cssComponents}
`;
