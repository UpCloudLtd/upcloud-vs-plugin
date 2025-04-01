import * as vscode from 'vscode';
import { ObjectStorageConfig } from '../common/UpCloudTypes';

export class UpCloudKeyManager {
  public static async PromptForKeysIfMissing(context: vscode.ExtensionContext, storage: ObjectStorageConfig): Promise<ObjectStorageConfig | undefined> {
    const key = `upcloud-storage-creds-${storage.service_uuid}`;
    const existing = await context.secrets.get(key);

    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        return {
          ...storage,
          accessKeyId: parsed.accessKeyId,
          secretAccessKey: parsed.secretAccessKey,
        };
      } catch (e) {
        vscode.window.showErrorMessage(`Failed to parse saved credentials for ${storage.name}`);
        return undefined;
      }
    }

    const accessKeyId = await vscode.window.showInputBox({
      prompt: `Enter Access Key ID for ${storage.name}`,
      ignoreFocusOut: true
    });

    const secretAccessKey = await vscode.window.showInputBox({
      prompt: `Enter Secret Access Key for ${storage.name}`,
      password: true,
      ignoreFocusOut: true
    });

    if (!accessKeyId || !secretAccessKey) {
      vscode.window.showWarningMessage(`Access not added for ${storage.name}`);
      return undefined;
    }

    const updated: ObjectStorageConfig = {
      ...storage,
      accessKeyId,
      secretAccessKey,
    };

    await context.secrets.store(key, JSON.stringify({ accessKeyId, secretAccessKey }));
    vscode.window.showInformationMessage(`Credentials saved for ${storage.name}`);
    return updated;
  }
}
