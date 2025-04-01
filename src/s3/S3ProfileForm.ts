import * as vscode from 'vscode';
import { S3Profile } from '../common/S3Profile';
import { S3TreeView } from './S3TreeView';
import * as ui from '../common/UI';

export class S3ProfileForm {
	public static Show(extensionUri: vscode.Uri) {
		const panel = vscode.window.createWebviewPanel(
			's3AddProfile',
			'Add S3 Profile',
			vscode.ViewColumn.One,
			{ enableScripts: true }
		);

		panel.webview.html = this.getHtml(panel.webview, extensionUri);

		panel.webview.onDidReceiveMessage(message => {
			if (message.command === 'saveProfile') {
				const profile: S3Profile = message.data;

				if (!profile.name || !profile.accessKeyId || !profile.secretAccessKey) {
					ui.showErrorMessage('Name, Access Key ID, and Secret Access Key are required.', new Error('Missing fields'));
					return;
				}

				S3TreeView.Current?.S3ProfileList.push(profile);
				S3TreeView.Current!.SelectedProfileName = profile.name;
				S3TreeView.Current!.SaveState();
				S3TreeView.Current!.treeDataProvider.Refresh();
				ui.showInfoMessage(`Profile '${profile.name}' added and selected.`);
				panel.dispose();
			}
		});
	}

	private static getHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
		return `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Add S3 Profile</title>
			</head>
			<body>
				<h2>Add S3 Profile</h2>
				<form id="profile-form">
					<label>Profile Name: <input type="text" id="name" required /></label><br/>
					<label>Access Key ID: <input type="text" id="accessKeyId" required /></label><br/>
					<label>Secret Access Key: <input type="password" id="secretAccessKey" required /></label><br/>
					<label>Region: <input type="text" id="region" placeholder="e.g., us-east-1" /></label><br/>
					<label>Endpoint: <input type="text" id="endpoint" placeholder="optional" /></label><br/>
					<button type="submit">Add Profile</button>
				</form>

				<script>
					const vscode = acquireVsCodeApi();
					document.getElementById('profile-form').addEventListener('submit', (e) => {
						e.preventDefault();
						const profile = {
							name: document.getElementById('name').value,
							accessKeyId: document.getElementById('accessKeyId').value,
							secretAccessKey: document.getElementById('secretAccessKey').value,
							region: document.getElementById('region').value,
							endpoint: document.getElementById('endpoint').value,
						};
						vscode.postMessage({ command: 'saveProfile', data: profile });
					});
				</script>
			</body>
			</html>
		`;
	}
}
