import * as vscode from 'vscode';
import { ObjectStorageConfig } from '../common/UpCloudTypes';

export class UpCloudKeyManager {
  public static async GetStorageKeys(context: vscode.ExtensionContext, storage: ObjectStorageConfig): Promise<ObjectStorageConfig | undefined> {
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
  }
}
