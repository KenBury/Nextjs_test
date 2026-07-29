---
description: How to deploy the mobile client to an iPhone using a Windows machine and a free Apple ID.
---

# Workflow: iOS Sideloading (Windows)

This workflow is used when a local Mac is unavailable and the user needs to test the `conekiller_client` on a physical iPhone.

## Prerequisites

1.  **Windows Tools**: [Sideloadly](https://sideloadly.io/) or [AltStore](https://altstore.io/) installed.
2.  **Apple ID**: A valid free or paid Apple account.
3.  **USB Connection**: Physical iPhone connected to the Windows PC.

## Step 1: Trigger the Cloud Build

1.  Commit and Push your changes to the `main` or specific feature branch on GitHub.
2.  The GitHub Action `ios_build.yml` will trigger automatically.
3.  Wait for the build to complete (~10-15 minutes).

## Step 2: Retrieve the Binary

1.  Navigate to the **"Actions"** tab of your repository.
2.  Select the successful run.
3.  Scroll to **"Artifacts"** and download `Runner-Unsigned-IPA`.
4.  Extract the `.ipa` file from the ZIP.

## Step 3: Deployment via Sideloadly

1.  Open **Sideloadly** on Windows.
2.  Drag the `.ipa` file into the "IPA" icon.
3.  Enter your **Apple ID email**.
4.  Click **"Start"**.
5.  On the iPhone, go to **Settings > General > VPN & Device Management** and **Trust** the developer certificate.

## Step 4: Verification

1.  Launch the app on the iPhone.
2.  Verify AR camera functionality and GPS fix.
3.  Check logcat/console output via `flutter logs` if connected via USB.

---
// turbo-all
