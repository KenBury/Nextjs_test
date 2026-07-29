# OpenShift Local (CRC) Pure S2I Deployment Guide

This guide walks you through starting your **OpenShift Local** environment and deploying your **Next.js** application using **Pure Source-to-Image (S2I)**—no `Dockerfile` or local container builds required!

---

## 🔑 Understanding the Red Hat Pull Secret

### What is a Pull Secret?
A **Pull Secret** is an encrypted JSON file containing authentication tokens provided by Red Hat. 

### Why is it Required?
OpenShift Local (CRC) is **100% free for developers**, but Red Hat requires your cluster to authenticate when downloading official enterprise container base images (such as Red Hat Enterprise Linux UBI, Red Hat Node.js S2I images, CoreOS base layers, and OpenShift router images) from Red Hat's container registries (`registry.redhat.io` and `quay.io`).

### How to Get and Use Your Pull Secret (4 Quick Steps)

1. **Sign in to Red Hat**: Visit [Red Hat Hybrid Cloud Console - OpenShift Local](https://console.redhat.com/openshift/create/local) and log in (or create a free Red Hat Developer account).
2. **Download the File**: Scroll to the download section for Windows and click **"Download Pull Secret"**. This saves a file named `pull-secret` (or `pull-secret.txt`) to your `Downloads` folder.
3. **Start CRC with your Pull Secret**:
   ```powershell
   crc start -p "C:\Users\kenbu\Downloads\pull-secret.txt"
```
   *Alternative:* If you run `crc start` without `-p`, CRC will prompt you in the terminal: `Please enter the pull secret:`. You can copy and paste the contents of your text file directly into the terminal prompt.
4. **Automatic Saved Credentials**:  
   You only need to provide the pull secret **once**! CRC permanently saves it to `~/.crc/pull-secret.json`. On subsequent `crc start` commands, you won't need to specify `-p` ever again.

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
crc start -p "C:\Users\kenbu\Downloads\pull-secret.txt"
```

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

## 🔧 Troubleshooting & Windows Network Setup

### 1. Fixing Full Disk & Stuck `OpenShift: Starting` State
If `crc status` shows `Disk Usage: 32.68GB of 32.68GB` (100% full), OpenShift operators will fail to start.

Expand the VM disk to 50 GB:
```powershell
# Stop cluster VM
crc stop

# Increase VM disk size configuration to 50GB
crc config set disk-size 50

# Restart cluster
crc start
```

---

### 2. Windows `hosts` File Setup (`127.0.0.1` User-Mode Networking)
If `crc ip` returns `127.0.0.1` and your browser shows *"This site can't be reached"*, Windows needs to map `.testing` hostnames to `127.0.0.1`.

Open **PowerShell as Administrator** and execute:
```powershell
Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "`n127.0.0.1 console-openshift-console.apps-crc.testing oauth-openshift.apps-crc.testing api.crc.testing default-route-openshift-image-registry.apps-crc.testing nextjs-test-nextjs-test.apps-crc.testing"
```

Flush DNS cache:
```powershell
ipconfig /flushdns
crc console
```

---

### 3. Browser TLS Certificate Warning
When accessing `https://console-openshift-console.apps-crc.testing`:
- Chrome / Edge will display a self-signed SSL warning (*"Your connection is not private"* / `NET::ERR_CERT_AUTHORITY_INVALID`).
- Click **Advanced** -> Click **"Proceed to console-openshift-console.apps-crc.testing (unsafe)"**.

---

## 🚀 Step-by-Step Deployment Instructions (Pure S2I)

### Step 1: Log in to OpenShift Local CLI

```powershell
oc login -u developer -p developer https://api.crc.testing:6443
```

---

### Step 2: Create a New OpenShift Project

```powershell
oc new-project nextjs-test
```

---

### Option A: Build Directly from Your Local Folder (No GitHub Token Needed! 🚀)

```powershell
# 1. Delete previous build config if present
oc delete all -l app=nextjs-test

# 2. Create app definition for local directory streaming
oc new-app nodejs:20-ubi9 --name=nextjs-test

# 3. Stream your local folder directly into OpenShift and build!
oc start-build nextjs-test --from-dir=. --follow

# 4. Expose the OpenShift route
oc expose svc/nextjs-test
```

---

### Option B: Build from Private GitHub Repository

```powershell
# 1. Create GitHub secret with your PAT token
oc create secret generic github-secret --from-literal=username=KenBury --from-literal=password=<YOUR_GITHUB_PAT_TOKEN> --type=kubernetes.io/basic-auth

# 2. Link secret to OpenShift builder
oc secret link builder github-secret
oc set build-secret bc/nextjs-test github-secret --source

# 1. Create app and start build
oc new-app nodejs:20-ubi9~https://github.com/KenBury/Nextjs_test.git --name=nextjs-test
oc start-build bc/nextjs-test --follow

# 2. Patch OpenShift Service target port to Next.js port 3000
oc patch svc/nextjs-test --type=json -p='[{"op": "replace", "path": "/spec/ports/0/targetPort", "value": 3000}]'

# 3. Expose the route with HTTPS TLS Edge Termination
oc create route edge nextjs-test --service=nextjs-test
# Or patch existing route:
# oc patch route nextjs-test --type=json -p='[{"op": "add", "path": "/spec/tls", "value": {"termination": "edge"}}]'

# 4. Access your HTTPS URL
# https://nextjs-test-nextjs-test.apps-crc.testing
```

---

### Step 6: Get Your Live Application URL

```powershell
oc get route nextjs-test
```

Your app will be accessible at:  
`http://nextjs-test-nextjs-test.apps-crc.testing`

---

## 🔐 Injecting MSSQL Server Secrets into OpenShift

To test injecting MSSQL credentials from OpenShift Secrets into your Next.js application pods:

```powershell
# 1. Create the OpenShift secret
oc create secret generic mssql-secret `
  --from-literal=MSSQL_HOST=mssql.production.svc.cluster.local `
  --from-literal=MSSQL_PORT=1433 `
  --from-literal=MSSQL_DATABASE=PrecisionAnalyticsDB `
  --from-literal=MSSQL_USER=sa_analytics_admin `
  --from-literal=MSSQL_PASSWORD=P@ssw0rd!Precision2026

# 2. Inject secret environment variables into the Next.js deployment
oc set env deployment/nextjs-test --from=secret/mssql-secret
```

---

## 🛑 Stopping & Managing OpenShift Local

- **Check Status**: `crc status`
- **Stop Cluster**: `crc stop`
- **Delete Local VM**: `crc delete`
