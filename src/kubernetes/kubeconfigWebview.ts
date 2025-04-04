import * as vscode from 'vscode';

export function showKubeconfigWebview(kubeconfig: string) {
    const panel = vscode.window.createWebviewPanel(
      "kubeconfigView",
      "Kubeconfig",
      vscode.ViewColumn.One,
      { enableScripts: true }
    );
    panel.webview.html = getWebviewContent(kubeconfig);
  }
  
  function getWebviewContent(kubeconfig: string): string {
    // Escape for HTML, not YAML — so we keep line breaks and indentation
    const escaped = kubeconfig
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="
          default-src 'none';
          style-src 'unsafe-inline' https://cdn.jsdelivr.net;
          script-src 'unsafe-inline' https://cdn.jsdelivr.net;
        ">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css">
        <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/common.min.js"></script>
        <title>Kubeconfig</title>
        <style>
          body {
            font-family: sans-serif;
            padding: 20px;
            background-color: #1e1e1e;
            color: white;
          }
          pre {
            background: #2d2d2d;
            color: white;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
          }
          .copy-btn {
            margin-top: 10px;
            padding: 5px 10px;
            border: none;
            background-color: #007acc;
            color: white;
            border-radius: 4px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <h2>Kubeconfig</h2>
        <pre><code class="language-yaml" id="codeBlock">${escaped}</code></pre>
        <button class="copy-btn" onclick="copyToClipboard(this)">Copy</button>
  
        <script>
          hljs.highlightAll();
  
          function copyToClipboard(button) {
            const text = document.getElementById('codeBlock').innerText;
            navigator.clipboard.writeText(text)
              .then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => button.textContent = 'Copy', 1500);
              })
              .catch(err => {
                button.textContent = 'Failed';
                setTimeout(() => button.textContent = 'Copy', 1500);
              });
          }
        </script>
      </body>
      </html>
    `;
  }
  