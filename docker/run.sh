mkdir -p /chain-data

if [ -d "/chain-data/chains" ]
then
    chmod 777 -R /chain-data
fi

# dump local chain spec
#cargo run --release -- build-spec --dev --chain=local > /chain-data/spec_1_10.json

cargo run --release -- --ws-external --rpc-external --dev --base-path /chain-data --chain=chainspec.json
