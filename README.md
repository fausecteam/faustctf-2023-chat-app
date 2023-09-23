# Chat App

Our server code is implemented in [server](/server) and the Android application in [application](/application/).

## Challenge Idea

The main idea of this challenge is based on a flaw in MySQL as its string compare function is not case sensitive.
This means, a malicious actor can create anohter user with the same username as the flag user but one character capalized to then request all chats from this flag user.

## CI Example for a service using docker-compose

The .gitlab-ci.yml in this repo builds and pushes all possible images (docker-compose.yml is parsed and used to call kaniko).

In the vulnbox build process, the compose file is used to pull all images and include them in the vm.
