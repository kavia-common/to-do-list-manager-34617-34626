#!/bin/bash
cd /home/kavia/workspace/code-generation/to-do-list-manager-34617-34626/todo_react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

