# Container image releases

BamBuddy's GitHub Actions workflow publishes the application container image to GitHub Container Registry.

- Image: `ghcr.io/matthebanana/bambuddy`
- Mutable tag: `latest`
- Immutable tag: the source commit SHA

The **Build and Publish BamBuddy Image** workflow runs when a commit is pushed to `main` (including when a pull request is merged) and can also be started manually with `workflow_dispatch`.

After merging a change to `main`, wait for that workflow run to finish successfully before updating a deployment. On TrueNAS, update the app/container to pull `ghcr.io/matthebanana/bambuddy:latest` and redeploy it. The image build and publish workflow does not itself connect to or restart a TrueNAS system.
