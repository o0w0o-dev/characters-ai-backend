#!/bin/bash

CONTAINER_NAME="characters-ai-backend"

# save the current working directory
LOCAL_FOLDER_PATH=$(pwd)

# Get the base name of the path
BASE_NAME=$(basename "$LOCAL_FOLDER_PATH")

# if the base name is $CONTAINER_NAME
if [ "$BASE_NAME" == ${CONTAINER_NAME} ]; then
    echo "The name of current working directory is '${CONTAINER_NAME}'."
else
    echo "The name of current working directory is not '${CONTAINER_NAME}'."
    exit 1
fi

export CONTAINER_NAME=$CONTAINER_NAME

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