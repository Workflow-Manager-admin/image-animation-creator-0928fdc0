#!/bin/bash
cd /home/kavia/workspace/code-generation/image-animation-creator-0928fdc0/image_to_animation_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

