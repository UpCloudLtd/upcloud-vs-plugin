import * as vscode from 'vscode';
import { UpCloudProfile } from '../common/UpCloudTypes';

export class UpCloudProfileForm {
  public static Show(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
      'addUpCloudProfile',
      'Add UpCloud Profile',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    panel.webview.html = this.getHtml();

    panel.webview.onDidReceiveMessage(async message => {
      if (message.command === 'saveProfile') {
        const profile: UpCloudProfile = message.data;

        if (!profile.name || !profile.username || !profile.password) {
          vscode.window.showErrorMessage("All fields are required");
          return;
        }

        const profiles: UpCloudProfile[] = context.globalState.get('UpCloudProfiles', []);
        profiles.push(profile);
        await context.globalState.update('UpCloudProfiles', profiles);

        vscode.window.showInformationMessage(`Profile '${profile.name}' saved.`);
        panel.dispose();
      }
    });
  }

  private static getHtml(): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Add UpCloud Profile</title>
    </head>
    <body>
      <h2>Add UpCloud Profile</h2>
      <form id="profile-form">
        <label>Name: <input type="text" id="name" required /></label><br/>
        <label>Username: <input type="text" id="username" required /></label><br/>
        <label>Password: <input type="password" id="password" required /></label><br/>
        <button type="submit">Save Profile</button>
      </form>

      <script>
        const vscode = acquireVsCodeApi();
        document.getElementById('profile-form').addEventListener('submit', e => {
          e.preventDefault();
          const profile = {
            name: document.getElementById('name').value.trim(),
            username: document.getElementById('username').value.trim(),
            password: document.getElementById('password').value
          };
          vscode.postMessage({ command: 'saveProfile', data: profile });
        });
      </script>
    </body>
    </html>`;
  }
}
