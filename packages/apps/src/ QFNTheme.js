// [object Object]
// SPDX-License-Identifier: Apache-2.0

import { createGlobalStyle } from 'styled-components';

const primaryColor = '#3C3C3C';
const secondaryColor = '#CFC289';
const activeTabColor = '#D07676';
const borderColor = '#D9D9D9';
const menuItemColor = '#FFFFFF';
const headerColor = '#D9D9D9';
const headerTextColor = '#000000';
const menuSeparatorColor = '#A8A8A8';
const menuActiveColor = '#565050';

export const QFNTheme = createGlobalStyle`
  #root {

    a {
      background-color: none !important;
    }

    // MAIN BODY BACKGROUND
    .apps--Wrapper {
      background: #FFFFFF url('./assets/images/bg_Home.png') no-repeat right top !important;
      background-size: 100%;
    }

    // LOGO AND INFO
    .apps--SideBar-logo-inner {
      width: 160px;
      height: 60px;
      background: url('./assets/images/logo.svg') no-repeat left center;
      background-size: 36px;

      img {
        display: none;
      }
    }

    // HEADER
    header {
      background: ${headerColor} !important;

      a {
        color: ${headerTextColor} !important;
        &.active {
          color: ${activeTabColor} !important;
        }
      }

      .active-tab {
        color: ${headerTextColor} !important;
      }
    }

    .theme--dark .ui--Tabs .active .tabLinkText::after,
    .theme--light .ui--Tabs .active .tabLinkText::after {
      background: ${activeTabColor} !important;
    }

    .gGcGYY {
      border-right: 1px solid ${menuSeparatorColor} !important;
      svg {
        display: none;
      }
    }

    // TABLES
    .ui--Table a {
      color: ${secondaryColor} !important;
    }

    .ui--Table table {
      border-collapse: separate !important;  // Important for margins

      th {
       background: #F5F5F5 !important;
      }

      td {
        border-top: none;
        border-bottom: none;
        background: #f5f5f5;
      }

      td:first-child {
        border-left: none;
      }

      td:last-child {
        border-right: none;
      }
    }

    // OVERLAY FOR THE POLKA PINK COLOR
    .highlight--bg {
      background: ${primaryColor} !important;
    }

    .ui--Progress .highlight--bg {
      background: ${secondaryColor} !important;
    }

    .highlight--border {
        border-color: ${primaryColor} !important;
    }

    .highlight--color {
      color: ${primaryColor} !important;
    }

    .ui--Button {
      &:not(.isDisabled):not(.isIcon):not(.isBasic),
      &.withoutLink:not(.isDisabled) {
        // .ui--Icon {
        //   background: ${primaryColor} !important;
        // }
      }

      &:hover:not(.isDisabled):not(.isReadOnly),
      &.isSelected {
        background: ${primaryColor} !important;
      }
    }

    // MENU ITEMS HOVER STATE
    .menuItems li:hover .groupHdr,
    .ui--MenuItem.isActive.topLevel:hover a {
      color: ${menuItemColor} !important;
      background: ${menuActiveColor} !important;
      box-shadow: none !important;
      border-radius: 10px 10px 0 0;
    }


    .groupMenu {
      background: #635e5e !important;
    }

    .cXYPcs .groupMenu {
      border-radius: 0;
      top: 56px;
    }

    .ui--MenuItem.topLevel:hover a {
      color: ${menuItemColor} !important;
      background: ${menuActiveColor} !important;
      box-shadow: none !important;
      border-radius: 10px;
    }

    .cXYPcs.isActive .groupHdr {
      border-radius: 10px;
    }

    // .ui--MenuItem.topLevel {
    //   border-radius: 10px 10px 0 0;
    // }

    .ui--MenuItem.isActive .ui--Badge {
      background: ${primaryColor} !important;
    }

    .ui--Tab .ui--Badge {
      background: ${activeTabColor} !important;
    }

    .theme--dark,
    .theme--light {
      .ui.primary.button,
      .ui.buttons .primary.button {
        background: ${primaryColor} !important;

        &.active,
        &:active,
        &:focus,
        &:hover {
          background-color: ${primaryColor} !important;
        }
      }
    }

    .theme--dark .ui--Toggle.isChecked:not(.isRadio) .ui--Toggle-Slider,
    .theme--light .ui--Toggle.isChecked:not(.isRadio) .ui--Toggle-Slider {
      background: ${primaryColor} !important;
    }

    .highlight--before-border:before,
    .theme--dark .ui--Toggle.isChecked:not(.isRadio) .ui--Toggle-Slider:before,
    .theme--light .ui--Toggle.isChecked:not(.isRadio) .ui--Toggle-Slider:before {
      border-color: ${primaryColor} !important;
    }

    .ui--Button.isBasic:not(.isDisabled):not(.isIcon):not(.isSelected):not(.isReadOnly) {
      box-shadow: none !important;
    }

    .ui--Button.isBasic:not(.isDisabled):not(.isIcon):not(.isSelected) .ui--Icon {
      color: ${primaryColor} !important;
    }
  }

  // HIDE NOT NEEDED COMPONENTS
  //.ui--NodeInfo,
  //.ui--Sidebar,
  //.menuSection.media--1200 {
  //  display: none !important;
  //}

  // NOTICE ON THE TOP RIGHT SIDE
  .apps--notice {
    display: none;

    @media (min-width: 1150px) {
      display: block;
      position: absolute;
      top: 85vh;
      right: 30px;
      min-width: 315px;
      padding: 4px 4px 4px 20px;
      background: #3C3C3C;
      color: #FFFFFF;
      border: 1px solid #CFC289;
      font-size: 12px;
      min-height: 63px;
      opacity: 0.7;
      z-index: 1000;
    }

    strong {
      font-weight: normal;
      color: ${secondaryColor};
      display: block;
      padding: 0;
      margin: 2px 0 4px 0;
    }
  }

`;
