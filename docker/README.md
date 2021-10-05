# Building docker image

This script will build the docker image with the wallet and publish it to the ECR repository:

```bash
./docker/build.sh
```

# Infra where the image is run

Infra is created from CloudFormation templates.
There are following templates:

- `vpc.yml` : creates a VPC with 4 subnets, 2 private and 2 public
- `security_groups.yml` : configures security group(s) for an EC2 instance where the wallet is hosted
- `bastion.yml` : creates and EC2 instance in a public subnet, with EIP

# Stack

The stack that runs in the EC2 is defined in the `docker/docker-compose.yml` file.
I composes of an [nginx proxy](https://github.com/nginx-proxy/nginx-proxy), [certificate companion](https://github.com/nginx-proxy/acme-companion) for the proxy and the docker image with the wallet itself.

## Basic comands

Regular docker / compose commands.
Start the stack:

```bash
docker-compose -f docker-compose.yml
```

List running containers:

```bash
docker ps
```

View the logs from one of the running containers (e.g. `nginx`):

```bash
docker logs <container-name> --follow --tail 100
```

Stop all containers:

```bash
docker-compose -f docker-compose.yml stop
```

Restart the stack:

```bash
docker-compose -f docker-compose.yml restart
```
