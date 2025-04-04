import * as vscode from 'vscode';

export function getPluginUserAgent(): string {
  const extension = vscode.extensions.getExtension('Upcloud.upcloud-vs-code-plugin');
  const pluginVersion = extension?.packageJSON.version || 'unknown';
  const vscodeVersion = vscode.version;

  return `UpCloudVSCodePlugin/${pluginVersion} vscode-${vscodeVersion}`;
}