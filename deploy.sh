#!/bin/bash

# Configuration
SERVER="root@72.60.92.164"
BACKEND_DIR="/var/www/v-dental-clinic/backend"
TARGET_DIR="$BACKEND_DIR/dist"
LOCAL_DIR="./dist"
APP_NAME="v-dental"

echo "Starting backend deployment to $SERVER:$TARGET_DIR"

# Step 1: Move uploads directory to parent
echo "Preserving uploads directory..."
ssh $SERVER "cd $TARGET_DIR && mv uploads ../"

# Step 2: Clean the remote dist directory
echo "Cleaning remote dist directory..."
ssh $SERVER "cd $TARGET_DIR && rm -rf *"

# Step 3: Deploy new files
echo "Deploying new backend files..."
scp -r $LOCAL_DIR/* $SERVER:$TARGET_DIR/

# Step 4: Restore uploads directory
echo "Restoring uploads directory..."
ssh $SERVER "cd $BACKEND_DIR && mv uploads ./dist"

# Step 5: Ask user about running migrations
echo ""
read -p "Do you want to run database migrations? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running database migrations..."
    ssh $SERVER "cd $BACKEND_DIR && npm run migration:run"
    echo "Migrations completed!"
else
    echo "Skipping migrations..."
fi

# Step 6: PM2 process management
echo "Restarting PM2 process..."
ssh $SERVER "cd $BACKEND_DIR && \
             pm2 delete $APP_NAME && \
             pm2 save && \
             pm2 start ecosystem.config.js --env production && \
             pm2 save && \
             pm2 startup"

echo "Backend deployment completed successfully!"