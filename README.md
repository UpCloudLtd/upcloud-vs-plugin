# 💻 Installation

You can install this plugin without publishing it to the marketplace by following these steps:

## 1. Download the `.vsix` Package

- Visit the [Releases](https://github.com/UpCloudLtd/upcloud-vs-plugin/releases) page of this repository.
- Download the latest `.vsix` file (e.g., `upcloud-vs-code-plugin-x.y.z.vsix`).

## 2. Install in VS Code

There are two ways to install:

### 🖱️ Option A: Using the VS Code GUI

1. Open VS Code.
2. Go to the Extensions view (⇧⌘X or Ctrl+Shift+X).
3. Click the `...` menu (top-right) → `Install from VSIX...`
4. Choose the `.vsix` file you downloaded.

### 🧑‍💻 Option B: Using the Command Line

```bash
code --install-extension path/to/upcloud-vs-code-plugin-x.y.z.vsix
```

# UpCloud Extension for Visual Studio Code

The **UpCloud** extension for Visual Studio Code features are:

## Object Storage Managment
Empowers users to seamlessly browse and manage their Object Storages and buckets, files, and folders directly within the VS Code editor.

### Features

With this extension, you can efficiently perform a wide range of tasks, including:

- **File Management**:  
  - Rename, copy, move, delete, upload, and download files.  

- **Folder Management**:  
  - Create, rename, copy, move, delete, and download folders.  

- **Enhanced Copying Options**:  
  - Copy file names (with or without extensions), keys, ARNs, URLs, and S3 URIs.  

- **Advanced Search**:  
  - Search across all buckets using file names, extensions, folders, or keys.  

## Why Use It?

Whether you’re a developer, data scientist, or system administrator, the **UpCloud** extension simplifies your workflow with an intuitive, user-friendly interface designed to make Object Storage resource management faster and more convenient.

### Kubernetes Kubeconfig Inspection

- **View all cluster**:
  - View all cluster under your account

- **Inspect Kubeconfig**
  - For each cluster you will be able to see its kubeconfig