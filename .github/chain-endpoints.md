---
title: Unavailable chain endpoints {{ date | date('ddd, MMM D YYYY, h:mm:ss a') }}
labels: ['ci']
---

cc @polkadot-js/notifications

Some configured endpoints are not available.

Check the nightly cron output (or via `yarn ci:chainEndpoints` locally) and disable the chains (either with `isDisabled` or `isUnreachable`) until the issue is resolved. The output as found from the test includes:
