# Get Started

## Release Docker images

- Create a new branch from `develop` branch, named as `v1.0.0` for instance;
- `git push --set-upstream origin v1.0.0`;
- `git tag -a 1.0.0`;
- `git push --tags -f`;
- Create a PR to merge `v1.0.0` to `develop`;
- Once the PR is merged, Docker publishing action should be triggered;
- Go to DockerHub, ensure the docker image can be pulled as `apps:latest` and `apps:1.0.0`;
