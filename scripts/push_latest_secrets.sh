#!/bin/bash

SECRET_NAME="fns-env-file"
GIT_ROOT=$(git rev-parse --show-toplevel)
SECRETS_FILE=$GIT_ROOT/functions/.env

# Check if secrets file exists
if [ ! -f "$SECRETS_FILE" ]; then
    echo "Error: Secrets file not found at $SECRETS_FILE"
    exit 1
fi

# Fetch latest secret version
REMOTE_SECRET=$(gcloud secrets versions access "latest" --secret="$SECRET_NAME" --project=e2e-poc-web)
if [ $? -ne 0 ]; then
    echo "Error: Failed to fetch secret from Google Cloud"
    exit 1
fi

# Calculate MD5 hashes
LOCAL_MD5=$(cat "$SECRETS_FILE" | tr -d '\n' | md5sum | cut -d' ' -f1)
REMOTE_MD5=$(echo "$REMOTE_SECRET" | tr -d '\n' | md5sum | cut -d' ' -f1)

# Compare hashes and update if different
if [ "$LOCAL_MD5" != "$REMOTE_MD5" ]; then
    echo "Secrets differ, updating in Google Cloud..."
    if gcloud secrets versions add "$SECRET_NAME" --data-file="$SECRETS_FILE" --project=e2e-poc-web; then
        echo "Secret updated successfully"
    else
        echo "Error: Failed to update secret in Google Cloud"
        exit 1
    fi
else
    echo "Secrets are in sync, no update needed"
fi


