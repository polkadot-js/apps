# cennznet/ui development

## Publish

### Docker image with a tag labbeld as latest

- Whenever a PR is merged into `develop` branch, a docker image with `latest` tag should be generated;

### Docker image with a tag labbeled as a version number

- Create a new branch from `develop` branch, named as `release/1.0.0` for instance;
- `git push --set-upstream origin 1.0.0`;
- `git tag -a 1.0.0`;
- `git push --tags -f`;
- At this point a Docker image with a tag as `1.0.0` should be generated;
- Create a PR to merge `release/1.0.0` branch to `develop`;
- Once the PR is merged, a Docker image with a tag as `latest` should be generated;
- Go to DockerHub, ensure the docker image can be pulled as `cennznet/ui:latest` and `cennznet/ui:release-1.0.0`;
