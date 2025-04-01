import * as vscode from 'vscode';
import { UpCloudProfile } from '../common/UpCloudTypes';

export class UpCloudProfileManager {
  public static async SelectProfile(context: vscode.ExtensionContext): Promise<UpCloudProfile | undefined> {
    const profiles: UpCloudProfile[] = context.globalState.get('UpCloudProfiles', []);

    if (profiles.length === 0) {
      vscode.window.showErrorMessage("No UpCloud profiles found. Please add one first.");
      return undefined;
    }

    const items = profiles.map(p => ({ label: p.name, profile: p }));
    const picked = await vscode.window.showQuickPick(items, { placeHolder: 'Select an UpCloud profile' });

    if (picked) {
      await context.globalState.update('SelectedUpCloudProfile', picked.profile);
      vscode.window.showInformationMessage(`Selected UpCloud profile: ${picked.label}`);
      return picked.profile;
    }

    return undefined;
  }

  public static GetSelectedProfile(context: vscode.ExtensionContext): UpCloudProfile | undefined {
    return context.globalState.get('SelectedUpCloudProfile');
  }
}