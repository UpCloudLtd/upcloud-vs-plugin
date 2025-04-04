# Developing the UpCloud VS Code Plugin

## 🧰 Prerequisites

- Node.js (v16+)
- VS Code

## 📦 Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/YOUR_ORG/upcloud-plugin.git
cd upcloud-plugin
npm install
```
## Build and Run
To compile the TypeScript code:
```bash
npm run compile
```
To start the plugin in a VS Code extension dev window:
From the project root folder:
```bash
code . 
```
Press F5


## 📚 Notes

### Syntax Highlighting (Kubeconfig View)

We use [highlight.js](https://highlightjs.org/) via CDN inside the WebView to highlight the YAML kubeconfig output.

The relevant files are loaded from the CDN:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css">
<script src="https

