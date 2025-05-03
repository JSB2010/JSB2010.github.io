#!/bin/bash

# Script to push changes to GitHub

echo "Adding all changes to git..."
git add .

echo "Committing changes..."
git commit -m "Implement contact form with Firestore and email notifications"

echo "Pushing to GitHub..."
git push origin modern-redesign-shadcn

echo "Done! Changes have been pushed to GitHub."
echo "Cloudflare Pages will automatically build and deploy the website."
