// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

// JSDom
import jsdom from 'jsdom';
const { JSDOM } = jsdom;
const { document } = new JSDOM('<!doctype html><html><body></body></html>').window;
global.document = document;
global.window = document.defaultView;
global.navigator = global.window.navigator;

// Chai and Sinon
import chai from 'chai';
import {expect, assert} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sinonAsPromised from 'sinon-as-promised';

chai.use(sinonChai);
global.sinon = sinon;
global.assert = assert;
global.expect = expect;
