#!/bin/bash

# Check if an argument was provided
if [ $# -eq 0 ]; then
    echo "No env provided."
    echo "Usage: $0 <env>"
    exit 1
fi

# The first argument is the env
ENV=$1
echo "ENV: $ENV"

FOLDER_NAME="characters-ai-backend"
CONTAINER_NAME="characters-ai-${ENV}-backend"

# save the current working directory
LOCAL_FOLDER_PATH=$(pwd)

# Get the base name of the path
BASE_NAME=$(basename "$LOCAL_FOLDER_PATH")

# if the base name is $CONTAINER_NAME
if [ "$BASE_NAME" == ${FOLDER_NAME} ]; then
    echo "The name of current working directory is '${FOLDER_NAME}'."
else
    echo "The name of current working directory is not '${FOLDER_NAME}'."
    exit 1
fi

export CONTAINER_NAME=$CONTAINER_NAME

# sops -d ./ansible/$ENV/secrets.enc.env > .env
cp ./ansible/$ENV/.env .env
cp ./ansible/$ENV/Dockerfile.$ENV Dockerfile
cp ./ansible/$ENV/docker-compose.$ENV.yml docker-compose.yml

# remove container if running
docker rm -f ${CONTAINER_NAME} || true

# Run Docker Compose
if command -v docker-compose &> /dev/null; then
    docker-compose up -d --build
else
    docker compose up -d --build
fi

# Follow the logs of the container
# Ensure that the correct container name or ID is used
docker logs -f -t ${CONTAINER_NAME}