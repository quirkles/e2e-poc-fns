GIT_ROOT=$(git rev-parse --show-toplevel)

rm -f "$GIT_ROOT/functions/.env.patch"
rm -f "$GIT_ROOT/functions/.env.latest"

gcloud secrets versions access latest --secret=fns-env-file --project=e2e-poc-web > $GIT_ROOT/functions/.env.latest

if [ ! -f "$GIT_ROOT/functions/.env" ]; then
    mv "$GIT_ROOT/functions/.env.latest" "$GIT_ROOT/functions/.env"
    exit 0
fi


diff -u $GIT_ROOT/functions/.env $GIT_ROOT/functions/.env.latest > $GIT_ROOT/functions/.env.diff

if [ ! -s "$GIT_ROOT/functions/.env.diff" ]; then
    rm -f "$GIT_ROOT/functions/.env.diff"
    mv "$GIT_ROOT/functions/.env.latest" "$GIT_ROOT/functions/.env"
    exit 0
fi

if [ "$1" = "--ci-mode" ] || [ "$1" = "-ci" ]; then
    echo "Error: Environment file mismatch detected in CI mode. Please resolve differences locally."
    exit 1
fi

echo "Latest env from secrets does not match current env. Resolve differences shown in .env.diff locally and push the correct version to secrets"
