// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

const xmlserializer = require('xmlserializer');

const identicon = require('./index');

describe('identicon', () => {
  it('generates a basic [0,..,0] identicon', () => {
    expect(
      xmlserializer.serializeToString(
        identicon(new Uint8Array(32))
      )
    ).toEqual('<div xmlns="http://www.w3.org/1999/xhtml" class="" style="background: white; border-radius: 128px; display: inline-block; height: 256px; margin: 0px; overflow: hidden; padding: 0px; width: 256px;"><div class="" style="border-radius: 128px; display: inline-block; height: 256px; margin: 0px; overflow: hidden; padding: 0px; width: 256px;"><svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="256" height="256"><circle cx="128" cy="140.8" r="128" fill="hsla(12.899999999999977, 100%, 49.4%, 0.9)"/><circle cx="128" cy="153.6" r="102.4" fill="hsla(174.29999999999995, 93.7%, 18.8%, 0.9)"/><circle cx="128" cy="166.4" r="76.8" fill="hsla(0.10000000000002274, 99.2%, 48.6%, 0.9)"/><circle cx="128" cy="179.2" r="51.2" fill="hsla(326.20000000000005, 97.4%, 54.3%, 0.9)"/><circle cx="128" cy="192" r="25.6" fill="hsla(326.20000000000005, 81.7%, 42.9%, 0.9)"/></svg></div></div>');
  });

  it('allows overrides', () => {
    expect(
      xmlserializer.serializeToString(
        identicon(new Uint8Array(32), 100, 'testClass', { display: 'block' })
      )
    ).toEqual('<div xmlns="http://www.w3.org/1999/xhtml" class="testClass" style="background: white; border-radius: 50px; display: block; height: 100px; margin: 0px; overflow: hidden; padding: 0px; width: 100px;"><div class="" style="border-radius: 50px; display: inline-block; height: 100px; margin: 0px; overflow: hidden; padding: 0px; width: 100px;"><svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="100" height="100"><circle cx="50" cy="55" r="50" fill="hsla(12.899999999999977, 100%, 49.4%, 0.9)"/><circle cx="50" cy="60" r="40" fill="hsla(174.29999999999995, 93.7%, 18.8%, 0.9)"/><circle cx="50" cy="65" r="30" fill="hsla(0.10000000000002274, 99.2%, 48.6%, 0.9)"/><circle cx="50" cy="70" r="20" fill="hsla(326.20000000000005, 97.4%, 54.3%, 0.9)"/><circle cx="50" cy="75" r="10" fill="hsla(326.20000000000005, 81.7%, 42.9%, 0.9)"/></svg></div></div>');
  });
});
