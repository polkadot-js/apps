---
title: Unavailable chain endpoints {{ date | date('ddd, MMM D YYYY, h:mm:ss a') }}
labels: ['ci']
---

cc @polkadot-js/notifications

Some configured endpoints are not available.

Check the nightly cron output (or via `yarn ci:chainEndpoints` locally) and disable the chains (either with `isDisabled` or `isUnreachable`) until the issue is resolved. The output as found from the test includes:

	 x /Users/spacecommander/Dev/polkadot-js/apps/packages/apps-config/src/ci/chainEndpoints.spec.ts
	   AssetHub @ wss://statemint.api.onfinality.io/public-ws

		 testCodeFailure / ERR_TEST_FAILURE

		 Connection timeout

	 x /Users/spacecommander/Dev/polkadot-js/apps/packages/apps-config/src/ci/chainEndpoints.spec.ts
	   Moonbeam @ wss://moonbeam.public.curie.radiumblock.co/ws

		 testCodeFailure / ERR_TEST_FAILURE

		 Connection error

	 x /Users/spacecommander/Dev/polkadot-js/apps/packages/apps-config/src/ci/chainEndpoints.spec.ts
	   Watr Network @ wss://watr.public.curie.radiumblock.co/ws

		 testCodeFailure / ERR_TEST_FAILURE

		 Connection error

	 x /Users/spacecommander/Dev/polkadot-js/apps/packages/apps-config/src/ci/chainEndpoints.spec.ts
	   Crust Shadow @ wss://rpc-shadow.crustnetwork.cc

		 testCodeFailure / ERR_TEST_FAILURE

		 Connection timeout

	 x /Users/spacecommander/Dev/polkadot-js/apps/packages/apps-config/src/ci/chainEndpoints.spec.ts
	   Krest @ wss://krest.unitedbloc.com/

		 testCodeFailure / ERR_TEST_FAILURE

		 Connection error

	 x /Users/spacecommander/Dev/polkadot-js/apps/packages/apps-config/src/ci/chainEndpoints.spec.ts
	   Moonriver @ wss://moonriver.public.curie.radiumblock.co/ws

		 testCodeFailure / ERR_TEST_FAILURE

		 Connection error

	 x /Users/spacecommander/Dev/polkadot-js/apps/packages/apps-config/src/ci/chainEndpoints.spec.ts
	   RegionX Cocos @ wss://cocos-node.regionx.tech

		 testCodeFailure / ERR_TEST_FAILURE

		 Connection error

	 x /Users/spacecommander/Dev/polkadot-js/apps/packages/apps-config/src/ci/chainEndpoints.spec.ts
	   Rhala Testnet @ wss://rhala-node.phala.network/ws

		 testCodeFailure / ERR_TEST_FAILURE

		 Connection error

	 x /Users/spacecommander/Dev/polkadot-js/apps/packages/apps-config/src/ci/chainEndpoints.spec.ts
	   Paseo @ wss://api2.zondax.ch/pas/node/rpc

		 testCodeFailure / ERR_TEST_FAILURE

		 Connection timeout

	 x /Users/spacecommander/Dev/polkadot-js/apps/packages/apps-config/src/ci/chainEndpoints.spec.ts
	   Darwinia Koi @ wss://koi-rpc.darwinia.network

		 testCodeFailure / ERR_TEST_FAILURE

		 Connection error

	 x /Users/spacecommander/Dev/polkadot-js/apps/packages/apps-config/src/ci/chainEndpoints.spec.ts
	   Edgeware @ wss://edgeware-rpc3.jelliedowl.net

		 testTimeoutFailure / ERR_TEST_FAILURE

	 x /Users/spacecommander/Dev/polkadot-js/apps/packages/apps-config/src/ci/chainEndpoints.spec.ts
	   SORA @ wss://mof3.sora.org

		 testCodeFailure / ERR_TEST_FAILURE

		 Connection timeout

	 x /Users/spacecommander/Dev/polkadot-js/apps/packages/apps-config/src/ci/chainEndpoints.spec.ts
	   Liberland testnet @ wss://testchain.liberland.org

		 testCodeFailure / ERR_TEST_FAILURE

		 No DNS entry

	 x /Users/spacecommander/Dev/polkadot-js/apps/packages/apps-config/src/ci/chainEndpoints.spec.ts
	   Subspace Gemini 3g Nova @ wss://nova.gemini-3g.subspace.network/ws

		 testCodeFailure / ERR_TEST_FAILURE

		 Connection timeout

	 x /Users/spacecommander/Dev/polkadot-js/apps/packages/apps-config/src/ci/chainEndpoints.spec.ts
	   Subspace Gemini 3h @ wss://rpc-1.gemini-3h.subspace.network/ws

		 testCodeFailure / ERR_TEST_FAILURE

		 Connection timeout

	 x /Users/spacecommander/Dev/polkadot-js/apps/packages/apps-config/src/ci/chainEndpoints.spec.ts
	   Subspace Gemini 3h Nova @ wss://nova-0.gemini-3h.subspace.network/ws

		 testCodeFailure / ERR_TEST_FAILURE

		 Connection timeout

	 x /Users/spacecommander/Dev/polkadot-js/apps/packages/apps-config/src/ci/chainEndpoints.spec.ts
	   check endpoints

		 subtestsFailed / ERR_TEST_FAILURE
