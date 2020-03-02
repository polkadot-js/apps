# Get Started

## Release Docker images

- Create a new branch off `develop` branch, named as `1.0.0` for instance;
- `git tag -a 1.0.0`;
- `git push --tags -f`;
- Create a PR to merge `1.0.0` to `develop`;
- Once the PR is merged, Docker publishing action should be triggered;
- Go to DockerHub, ensure the docker image can be pulled as `apps:latest` and `apps:1.0.0`;
