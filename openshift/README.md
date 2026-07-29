# OpenShift Local (CRC) Pure S2I Deployment Guide

This guide walks you through deploying your **Next.js** application to **OpenShift Local** using **Pure Source-to-Image (S2I)**—no `Dockerfile` or local container builds required!

---

## 📋 Prerequisites

1. **OpenShift Local (CRC)** running on your system (`crc start`).
2. **OpenShift CLI (`oc`)** installed and in your system PATH.
3. Your `Nextjs_test` code pushed to an accessible Git repository (e.g. GitHub or GitLab).

---

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Log in to OpenShift Local

```bash
oc login -u developer -p developer https://api.crc.testing:6443
```

---

### Step 2: Create a New OpenShift Project

```bash
oc new-project nextjs-test
```

---

### Step 3: Create App Using Pure Node.js S2I

Run `oc new-app` pointing to the official Red Hat Node.js 20 S2I image and your Git repository URL:

```bash
oc new-app nodejs:20~https://github.com/<YOUR_GITHUB_USERNAME>/Nextjs_test.git --name=nextjs-test
```

> **Note:** Replace `<YOUR_GITHUB_USERNAME>` with your actual GitHub username.

---

### Step 4: Track the In-Cluster S2I Build

OpenShift will launch a build pod inside the cluster to clone your Git repo, run `npm install`, and execute `npm run build`:

```bash
oc logs -f bc/nextjs-test
```

---

### Step 5: Expose the OpenShift Route (Public Access URL)

Once the build completes and pods are running, expose the service via the OpenShift router:

```bash
oc expose svc/nextjs-test
```

---

### Step 6: Get Your Live Application URL

```bash
oc get route nextjs-test
```

Your app will be accessible at:
`http://nextjs-test-nextjs-test.apps-crc.testing`

---

## 🔄 Automatic Redeployments on `git push`

To trigger an automatic build every time you push code to Git:

```bash
# Get the OpenShift Webhook URL
oc describe bc/nextjs-test | grep -A 2 "Webhook GitHub"

# Trigger a manual rebuild anytime without Git:
oc start-build bc/nextjs-test --follow
```
