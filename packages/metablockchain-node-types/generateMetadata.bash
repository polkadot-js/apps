#!/bin/bash
# Must run with a local edgeware chain available

curl -H "Content-Type: application/json" -d '{"id":"1", "jsonrpc":"2.0", "method": "state_getMetadata", "params":[]}' http://localhost:9933 > metablockchain.json