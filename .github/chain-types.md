---
title: Outdated chain types
labels: ['ci']
---

cc @polkadot-js/notifications

Some configured chains have outdated types and is determined to problematic as an available chain.

Check the nightly cron output (or via `yarn ci:chainTypes` locally) and disable the chains (either with `isDisabled` or `isUnreachable`) until the issue is resolved. The output as found from the test includes:
