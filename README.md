
# 🛠️ Version-Controlled DevOps Project with Git

A Git and GitHub-based DevOps project following **best branching, commit, and documentation practices**.  
Designed to simulate real-world version control workflows with **main**, **dev**, and **feature** branches, pull requests, tagging, and task documentation.

----------

## 🌟 Key Highlights

- 📂 **Structured Branching:** `main` → `dev` → `feature/*` workflow  
- 🔄 **Pull Requests:** Code review & approval process before merging  
- 📝 **README.md & Docs:** Professional project documentation in markdown  
- 🚫 **.gitignore:** Keeps repo clean from unnecessary files  
- 🏷️ **Tags & Releases:** Mark versions with Git tags for tracking  
- 📜 **Task Log:** Track progress and changes in markdown format  

----------

## ⚙️ Git Workflow Overview

This project demonstrates a collaborative Git workflow with **controlled branching** and **pull request merges**.

----------

### 🔄 Workflow Breakdown

#### 🛠️ 1. Repository Initialization
- Initialize Git locally and push to GitHub  
- Set up `.gitignore` for environment-specific files  

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <repo-URL>
git push -u origin main

```

----------

#### 🌱 2. Branching Strategy

-   **Main Branch (`main`)** → Stable production-ready code
    
-   **Development Branch (`dev`)** → Active development & integration
    
-   **Feature Branch (`feature/<name>`)** → Isolated new feature work
    

```bash
git checkout -b dev
git push -u origin dev
git checkout -b feature/my-feature

```

----------

#### 🔄 3. Pull Requests & Code Review

-   Push your `feature/*` branch to GitHub
    
-   Open PR → Review → Merge into `dev`
    
-   After testing, merge `dev` into `main`
    

----------

#### 🏷️ 4. Version Tagging

-   Tag a release after merging to `main`
    

```bash
git tag v1.0
git push origin v1.0

```

----------

## 📂 Project Structure

```
├── README.md           # Project documentation
├── .gitignore          # Ignored files & folders
├── docs/
│   ├── TASK_LOG.md     # Markdown task progress log
└── src/                # Project source files

```

----------

## 🚀 Local Setup

**1. Clone Repository**

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

```

**2. Create & Switch Branches**

```bash
git checkout -b dev
git checkout -b feature/sample-feature

```

**3. Make Changes & Commit**

```bash
git add .
git commit -m "Added new feature"

```

**4. Push Branch to Remote**

```bash
git push -u origin feature/sample-feature

```

----------

## 📜 Example Pull Request Flow

1.  **Feature Branch** → `feature/login-ui`
    
2.  **Push to Remote** → `origin/feature/login-ui`
    
3.  **PR to Dev** → Review & Merge
    
4.  **Test in Dev** → Merge to Main
    
5.  **Tag Release** → `v1.0`
    

----------

## 📤 Output & Results

✅ Clean branch history  
✅ Documented tasks & changes  
✅ Controlled, review-based merges  
✅ Clear version tracking via tags

----------

## 📋 Project Tasks

**Objective:** Manage a DevOps project using Git best practices.  
**Tools:** Git, GitHub  
**Deliverables:** Project repo with proper commits, branching.


1.  Initialize repo and push to GitHub.
    
2.  Create `dev`, `feature`, and `main` branches.
    
3.  Use Pull Requests (PRs) to merge branches.
    
4.  Add a proper `README.md` with project details.
    
5.  Use `.gitignore` to exclude unnecessary files.
    
6.  Use Git tags for version releases.
    
7.  Document all tasks in markdown (`TASK_LOG.md`).
    

----------

