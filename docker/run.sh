mkdir -p /chain-data

if [ -d "/chain-data/chains" ]
then
    chmod 777 -R /chain-data
fi

# ls /chain-data/chains

cargo run --release -- --ws-external --rpc-external --dev --base-path /chain-data --chain=chainspec.json
