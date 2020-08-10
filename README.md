[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)
[![maintainability](https://img.shields.io/codeclimate/maintainability-percentage/polkadot-js/apps?logo=code-climate&style=flat-square)](https://codeclimate.com/github/polkadot-js/apps)

# @polkadot/apps

A Portal into the Polkadot and Substrate networks. Provides a view and interaction layer from a browser.

This can be accessed as a hosted application via https://polkadot.js.org/apps/ or you can access the IPFS hosted version via https://polkadot.js.org/apps/ipfs (via hash) or https://dotapps.io (via ipns) to explore any of the supported Polkadot and Substrate chains.

If you run one or more IPFS node(s), pinning the UI (which only gets updated on releases) will make it faster for you and others. You can find details about that below in the IPFS chapter below.

**Important** If you are a chain developer and would like to add support for your chain to the UI, all the local configuration (API types, settings, logos) can be customized in [the apps-config package](packages/apps-config#README.md), complete with instructions of what goes where.

## overview

The repo is split into a number of packages, each representing an application. These are -

- [apps](packages/apps/) This is the main entry point. It handles the selection sidebar and routing to the specific application being displayed.
- [apps-electron](packages/apps-electron/) Desktop app running [apps](packages/apps/).
- [page-accounts](packages/page-accounts/) A basic account management app.
- [page-address-book](packages/page-address-book/) A basic address management app.
- [page-democracy](packages/page-democracy/) A basic voting app, allowing votes on activate proposals and referenda.
- [page-explorer](packages/page-explorer/) A simple block explorer. It only shows the most recent blocks, updating as they become available.
- [page-extrinsics](packages/page-extrinsics/) Submission of extrinsics to a node.
- [page-js](packages/page-js/) An online code editor with [@polkadot-js/api](https://github.com/polkadot-js/api/tree/master/packages/api) access to the currently connected node.
- [page-settings](packages/page-settings/) A basic settings management app, allowing choice of language, node to connect to, and theme
- [page-staking](packages/page-staking/) A basic staking management app, allowing staking and nominations.
- [page-storage](packages/page-storage/) A simple node storage query application. Multiple queries can be queued and updates as new values become available.
- [page-toolbox](packages/page-toolbox/) Submission of raw data to RPC endpoints and utility hashing functions.
- [page-transfer](packages/page-transfer/) A basic account management app, allowing transfer of Units/DOTs between accounts.

In addition the following libraries are also included in the repo. These are to be moved to the [@polkadot/ui](https://github.com/polkadot-js/ui/) repository once it reaches a base level of stability and usability. (At this point with the framework being tested on the apps above, it makes development easier having it close)

- [react-components](packages/react-components/) A reactive (using RxJS) application framework with a number of useful shared components.
- [react-signer](packages/react-signer/) Signer implementation for apps.
- [react-query](packages/react-query) Base components that use the RxJS Observable APIs

## Development

Contributions are welcome!

To start off, this repo (along with others in the [@polkadot](https://github.com/polkadot-js/) family) uses yarn workspaces to organize the code. As such, after cloning dependencies _should_ be installed via `yarn`, not via npm, the latter will result in broken dependencies.

To get started -

1. Clone the repo locally, via `git clone https://github.com/polkadot-js/apps <optional local path>`
2. Ensure that you have a recent LTS version of Node.js, for development purposes [Node >=10.13.0](https://nodejs.org/en/) is recommended.
3. Ensure that you have a recent version of Yarn, for development purposes [Yarn >=1.10.1](https://yarnpkg.com/docs/install) is required.
4. Install the dependencies by running `yarn`
5. Ready! Now you can launch the UI (assuming you have a local Polkadot Node running), via `yarn run start`
6. Access the UI via [http://localhost:3000](http://localhost:3000)

## Docker

You can run a docker container via -

```
docker run --rm -it --name polkadot-ui -e WS_URL=ws://someip:9944 -p 80:80 jacogr/polkadot-js-apps:latest
```

To build a docker container containing local changes -

```
docker build -t jacogr/polkadot-js-apps .
```

When using these Docker commands, you can access the UI via http://localhost:80 (or just http://localhost)

## IPFS

IPFS allows sharing files in a decentralized manner in a similar fashion the polkadot network exchanges blocks. IPFS works best when many nodes seed the same data. Nodes can seed specific data by **pinning** them.

You can pin with the following command:

```
curl -s https://polkadot.js.org/apps/ipfs/pin.json | jq -jr .IpfsHash | xargs -0 -I CID ipfs pin add --progress CID
```

Here is a script you can save as `/usr/local/bin/polkadotjs-ipfs-pin.sh`:

```
#!/usr/bin/env bash

IPFS='/usr/local/bin/ipfs'
curl -s https://polkadot.js.org/apps/ipfs/pin.json | jq -jr .IpfsHash | xargs -0 -I CID $IPFS pin add --progress CID
```

I suggest to run the script once. The output should be similar to (the CID/Hash will very likely be different though):
```
$ /usr/local/bin/polkadotjs-ipfs-pin.sh
pinned QmNYAbzaE8kRAf68YiN3ZuUxgdwroeav3JhicsHsG5b2oW recursively
```

Now that you know the CID (hash), you can check whether the data is already pinned or not:
```
$ ipfs pin ls | grep QmNYAbzaE8kRAf68YiN3ZuUxgdwroeav3JhicsHsG5b2oW
QmNYAbzaE8kRAf68YiN3ZuUxgdwroeav3JhicsHsG5b2oW recursive
```

Now that we know it works, we can automate that with a cron task. Run `crontab -e`.
If you see only comments, append the following to the file and save:
```
SHELL=/bin/bash
HOME=/
0 * * * * /usr/local/bin/polkadotjs-ipfs-pin.sh >/dev/null 2>&1
```

Now our script will run every hours at minute '0' (8:00, 9:00, etc...). To check, we can unpin temporarily:
```
$ ipfs pin rm QmNYAbzaE8kRAf68YiN3ZuUxgdwroeav3JhicsHsG5b2oW
unpinned QmNYAbzaE8kRAf68YiN3ZuUxgdwroeav3JhicsHsG5b2oW
```

Now asking for the CID confirms that is it not there.
```
$ ipfs pin ls QmNYAbzaE8kRAf68YiN3ZuUxgdwroeav3JhicsHsG5b2oW
Error: path 'QmNYAbzaE8kRAf68YiN3ZuUxgdwroeav3JhicsHsG5b2oW' is not pinned
```

Wait until the your cron task runs and try again:
```
$ ipfs pin ls QmNYAbzaE8kRAf68YiN3ZuUxgdwroeav3JhicsHsG5b2oW
QmNYAbzaE8kRAf68YiN3ZuUxgdwroeav3JhicsHsG5b2oW recursive
```

Tada! This is now automatic and you may forget it.

If you are curious and want to know how many people seed the UI on IPFS, here is the magic command (it may take a while to return the answer as ipfs will search for about 1 minute):
```
ipfs dht findprovs QmTejwB7mJPBHBoqubjzHSgSxfLMcjnZA3LFefqoQc87VJ | wc -l
```

If you are current about the content of what you just pinned, you may use the following command:
```
$ ipfs ls QmTejwB7mJPBHBoqubjzHSgSxfLMcjnZA3LFefqoQc87VJ
QmPJGyqVCcXm238noz7TZDByyGa35qqc8g6sfyXF3KDXZ3 38078   favicon.ico
QmdouVsVE9rMVB84Cy1ehVi1LAGW1fKcqqQxSEjgxJrv7H 668     index.html
QmWHcGf1JCFZCYjZsw52vM5RiJVbcNpX1fo2NyoBKBvtuf -       ipfs/
QmT6NwDsJzMyBs6bMq845nMumeJWbixBfNXA9hdAhAMdSG -       locales/
QmcgiZpwvpT1E1dkSS3zr5je89rZRVocNKPebgWhn3JVTC 2178582 main.ce05dfca.js
QmdnEtuhFDyw5Tjr82bFPzyveFrbkYjJAnUvBvzwT18YGG 337     manifest.json
QmW7gDKHbmtD7sRTqsvyo84bDpyYPZR3w1wQo8pme2q5HC -       next/
Qmd8UnRQiBobm4qb6dhiC1HoQ7SvwZrWJenoN3JPEV3iiF 480594  polkadotjs.3af757ad.js
QmUfXPMfNys8Y8dekuankBx7BHiSAjALCpBDKH6F5DdcNm 628284  react.0cecb00d.css
QmSEgXdQbC1ek9Td1mHy3BRvJpfWHm9zQYegTgAUj1QC4g 924156  react.8f083b49.js
QmfGBgFe2aqf83Wv21m9k5DH2ew89CDj4tydoxJWdK6NNL 1552    runtime.3d77e510.js
QmYPa8jcHH7gfopMALr5XTW4i1QM2xgVBe3NeP11y3tErA -       static/
QmeYBC5EgbccC8NEwXC2rvbd93YiHtTM5xYzqCDohXerDf 859984  vendor.8b793a81.js
```

## Desktop App

The main advantage of using Desktop App is that it by default stores encrypted accounts on the filesystem instead of browser's local storage.
Local storage is susceptible to attacks using XSS (Cross-Site Scripting). There's no such risk when with files stored on disk.

The desktop app uses the [Electron](https://www.electronjs.org/) framework. It provides the same features as web app, the only difference
being different account storage.

The accounts are stored in the following directories:
* Mac: `~/Library/Application Support/polkadot-apps/polkadot-accounts`
* Linux: `~/.config/polkadot-apps/polkadot-accounts` (or `$XDG_CONFIG_HOME/polkadot-apps/polkadot-accounts` if `$XDG_CONFIG_HOME` is defined)
* Windows: `%APPDATA%\polkadot-apps\polkadot-accounts`

For more details on the desktop app, head over to [Electron package README](https://github.com/polkadot-js/apps/blob/master/packages/apps-electron/README.md).
