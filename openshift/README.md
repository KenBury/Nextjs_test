# OpenShift Local (CRC) Pure S2I Deployment Guide

This guide walks you through starting your **OpenShift Local** environment and deploying your **Next.js** application using **Pure Source-to-Image (S2I)**—no `Dockerfile` or local container builds required!

---

## 🖥️ How to Start OpenShift Local (CRC)

### Step 1: Run Pre-Flight Environment Setup
Run `crc setup` to configure virtualization (Hyper-V / Podman / networking):

```powershell
crc setup
```

---

### Step 2: Start the OpenShift Local Cluster
Start the local single-node cluster:

```powershell
crc start
```

> **First-Time Launch Note:**  
> On your first launch, CRC will ask for a **Red Hat Pull Secret**. Download your free pull secret from [Red Hat Hybrid Cloud Console](https://console.redhat.com/openshift/create/local) and pass it via:
> ```powershell
> crc start -p "C:\path\to\pull-secret.txt"
> ```

---

### Step 3: Add `oc` CLI to Your Terminal Environment

In **PowerShell**:
```powershell
crc oc-env | Invoke-Expression
```

In **Git Bash / WSL / Linux**:
```bash
eval $(crc oc-env)
```

---

### Step 4: Verify Cluster Status & Retrieve Credentials

Check cluster state:
```powershell
crc status
```

Print login passwords for `developer` and `kubeadmin`:
```powershell
crc console --credentials
```

Open the OpenShift Web Console in your browser:
```powershell
crc console
```

---

## 🚀 Step-by-Step Deployment Instructions (Pure S2I)

### Step 1: Log in to OpenShift Local CLI

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

## 🛑 Stopping & Managing OpenShift Local

- **Check Status**: `crc status`
- **Stop Cluster**: `crc stop`
- **Delete Local VM**: `crc delete`
