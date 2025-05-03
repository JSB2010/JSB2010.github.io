#!/bin/bash

# Script to deploy Firebase Cloud Functions and push to GitHub

# Step 1: Build and deploy Firebase Functions
echo "Building Firebase Functions..."
cd functions
npm run build
cd ..

echo "Deploying Firebase Functions..."
firebase deploy --only functions

# Step 2: Commit and push changes to GitHub
echo "Committing changes to GitHub..."
git add .
git commit -m "Update contact form with Firestore and email notifications"

echo "Pushing to GitHub..."
git push origin modern-redesign-shadcn

echo "Done! Your contact form should now be fully functional."
echo "When someone submits the form, it will be saved to Firestore and you'll receive an email notification."
echo "Changes have been pushed to GitHub and will be automatically deployed to Cloudflare Pages."
