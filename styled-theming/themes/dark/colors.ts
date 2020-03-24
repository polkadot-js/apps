// Copyright 2019 Atlassian Pty Ltd
// This software may be modified and distributed under the terms
// of the Apache-2.0 license.

// Ref: https://bitbucket.org/atlassian/atlaskit-mk-2/src/master/packages/core/theme/src/colors.ts

import { rgba } from 'polished';

/** Nuetral */
export const N0 = '#FFFFFF';
export const N50 = '#F8F9F9';
export const N100 = '#EBECED';
export const N200 = '#D0D3D5';
export const N300 = '#B5BABD';
export const N400 = '#9AA0A5';
export const N500 = '#7F878D';
export const N600 = '#666D73';
export const N700 = '#4E5458';
export const N800 = '#363A3D';
export const N900 = '#1E2022';
export const N1000 = '#000000';

/** Red */
export const R100 = '#FBD2D3';
export const R200 = '#F7A3A6';
export const R300 = '#F37479';
export const R400 = '#EF454B';
export const R500 = '#EB161E';
export const R600 = '#BE1017';
export const R700 = '#8F0C11';
export const R800 = '#60080C';
export const R900 = '#310406';

/** Yellow */
export const Y100 = '#FFF3CC';
export const Y200 = '#FFE899';
export const Y300 = '#FFDC66';
export const Y400 = '#FFD133';
export const Y500 = '#FFC500';
export const Y600 = '#CC9E00';
export const Y700 = '#997600';
export const Y800 = '#664F00';
export const Y900 = '#332700';

/** Green */
export const G100 = '#CDECD6';
export const G200 = '#A9DDB8';
export const G300 = '#84CF9A';
export const G400 = '#5FC17C';
export const G500 = '#42AB61';
export const G600 = '#34864C';
export const G700 = '#266137';
export const G800 = '#173D22';
export const G900 = '#09180D';

/** Blue */
export const B100 = '#C8E6FF';
export const B200 = '#95CEFF';
export const B300 = '#63B6FE';
export const B400 = '#309FFE';
export const B500 = '#0187FA';
export const B600 = '#016CC7';
export const B700 = '#015094';
export const B800 = '#003562';
export const B900 = '#00192F';

/** Violet */
export const V100 = '#725EFF';
export const V200 = '#725EFF';
export const V300 = '#725EFF';
export const V400 = '#725EFF';
export const V500 = '#1130FF';
export const V600 = '#0000CA';
export const V700 = '#08187F';
export const V800 = '#040C40';
export const V900 = '#020835';

export const brandPrimary = rgba(17, 48, 255, 0.9);
export const brandSecondary = Y400;

export const primary = rgba(17, 48, 255, 0.9);
export const secondary = V800;
export const background = V900;
export const success = G400;
export const warning = Y400;
export const danger = R400;
export const info = N100;
export const nuetral = N500;
export const border = rgba(255, 255, 255, 0.3);
export const borderLight = N100;
export const text = N0;
export const textMuted = rgba(255, 255, 255, 0.6);
export const textHover = N200;
export const link = B500;
export const linkHover = B600;
/**
 * NOTICE: this file only contains basic color defination of basic elements like border,
 * text, link, etc.
 *
 * For application/ components resuable colors, theme/index.js is the file to be considered.
 *
 * */
