import * as vscode from 'vscode';
import { ObjectStorageConfig } from '../common/UpCloudTypes';

export class UpCloudKeyForm {
  public static Show(context: vscode.ExtensionContext, storage: ObjectStorageConfig) {
    const panel = vscode.window.createWebviewPanel(
      'enterStorageKeys',
      `Enter Keys for ${storage.name}`,
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    panel.webview.html = this.getHtml(storage);

    panel.webview.onDidReceiveMessage(async message => {
      if (message.command === 'saveKeys') {
        const { accessKeyId, secretAccessKey } = message.data;

        if (!accessKeyId || !secretAccessKey) {
          vscode.window.showErrorMessage("Both Access Key ID and Secret Access Key are required.");
          return;
        }

        const key = `upcloud-storage-creds-${storage.service_uuid}`;
        await context.secrets.store(key, JSON.stringify({ accessKeyId, secretAccessKey }));
        vscode.window.showInformationMessage(`Credentials saved for ${storage.name}`);

        panel.dispose();
        vscode.commands.executeCommand('UpCloudTreeView.Refresh');
      }
    });
  }

  private static getHtml(storage: ObjectStorageConfig): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Enter Keys</title>
    </head>
    <body>
      <h2>Enter Credentials for ${storage.name}</h2>
      <form id="key-form">
        <label>Access Key ID: <input type="text" id="accessKeyId" required /></label><br/>
        <label>Secret Access Key: <input type="password" id="secretAccessKey" required /></label><br/>
        <button type="submit">Save</button>
      </form>

      <script>
        const vscode = acquireVsCodeApi();
        document.getElementById('key-form').addEventListener('submit', e => {
          e.preventDefault();
          const accessKeyId = document.getElementById('accessKeyId').value.trim();
          const secretAccessKey = document.getElementById('secretAccessKey').value.trim();
          vscode.postMessage({ command: 'saveKeys', data: { accessKeyId, secretAccessKey } });
        });
      </script>
    </body>
    </html>`;
  }
}
