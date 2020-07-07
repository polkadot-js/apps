// Copyright 2019 Atlassian Pty Ltd
// This software may be modified and distributed under the terms
// of the Apache-2.0 license.

// Ref: https://bitbucket.org/atlassian/atlaskit-mk-2/src/master/packages/core/theme/src/colors.ts

import { rgba } from 'polished';

/** Neutral */
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
export const R50 = '#FFECEC';
export const R100 = '#FECECE';
export const R200 = '#FDB0B1';
export const R300 = '#F87A7C';
export const R400 = '#F04E50'; // Base Red
export const R500 = '#E52C2F';
export const R600 = '#D51B1E';
export const R700 = '#C01114';
export const R800 = '#A70C0E';
export const R900 = '#8C0A0C';

/** Yellow */
export const Y50 = '#FFFAE4';
export const Y100 = '#FEF3C7';
export const Y200 = '#FEEDA9';
export const Y300 = '#FCDF71';
export const Y400 = '#F8D143';
export const Y500 = '#F3C321'; // Base Yellow
export const Y600 = '#EBB509';
export const Y700 = '#E2A700';
export const Y800 = '#D69A00';
export const Y900 = '#C98D00';

/** Green */
export const G50 = '#E8FFF2';
export const G100 = '#D4FEE6';
export const G200 = '#C0FCDA';
export const G300 = '#9AF7C2';
export const G400 = '#7AF0AC';
export const G500 = '#60E497'; // Base Green
export const G600 = '#4CD483';
export const G700 = '#3DBF70';
export const G800 = '#30A55C';
export const G900 = '#268A4B';

/** Blue */
export const B50 = '#E6F6FF';
export const B100 = '#C5E9FD';
export const B200 = '#A4DBFC';
export const B300 = '#66C0F6';
export const B400 = '#34A7EC';
export const B500 = '#118FDE'; // Base Blue
export const B600 = '#007BCB';
export const B700 = '#0069B1';
export const B800 = '#005492';
export const B900 = '#004070';

export const red = '#F04E50';
export const yellow = '#F3C321';
export const green = '#60E497';
export const blue = '#118FDE';
export const grey = rgba(78,78,78,.66);


export const brandPrimary = rgba(17, 48, 255, 0.9);
export const brandSecondary = Y400;

export const primary = rgba(17, 48, 255, 0.9);
export const secondary = B800;
export const background = N50;
export const success = green;
export const warning = yellow;
export const danger = red;
export const info = N100;
export const nuetral = N500;
export const border = rgba(255, 255, 255, 0.3);
export const borderLight = N100;
export const text = N0;
export const textMuted = rgba(255, 255, 255, 0.6);
export const textHover = N200;
export const link = B500;
export const linkHover = B600;
export const popUpBackground = '#1B1C1D';
/*
 * NOTICE: this file only contains basic color defination of basic elements like border,
 * text, link, etc.
 *
 * For application/ components resuable colors, theme/index.js is the file to be considered.
 *
 * */
