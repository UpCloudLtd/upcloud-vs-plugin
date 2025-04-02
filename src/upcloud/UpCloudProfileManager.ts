import * as vscode from 'vscode';
import { UpCloudProfile } from '../common/UpCloudTypes';

export class UpCloudProfileManager {
  public static async SelectProfile(context: vscode.ExtensionContext): Promise<UpCloudProfile | undefined> {
    const profiles: UpCloudProfile[] = context.globalState.get('UpCloudProfiles', []);
  
    const items = [
      ...profiles.map(p => ({ label: p.name, profile: p })),
      { label: '+ Add New Profile', profile: undefined }
    ];
  
    const picked = await vscode.window.showQuickPick(items, { placeHolder: 'Select or add an UpCloud profile' });
  
    if (picked?.label === '+ Add New Profile') {
      const newProfile = await vscode.commands.executeCommand<UpCloudProfile>('S3TreeView.AddUpCloudProfile');
      if (newProfile) {
        await context.globalState.update('SelectedUpCloudProfile', newProfile);
        vscode.window.showInformationMessage(`Added and selected profile: ${newProfile.name}`);
        return newProfile;
      }
      return undefined;
    }
  
    if (picked?.profile) {
      await context.globalState.update('SelectedUpCloudProfile', picked.profile);
      vscode.window.showInformationMessage(`Selected UpCloud profile: ${picked.label}`);
      return picked.profile;
    }
  
    return undefined;
  }
  

  public static GetSelectedProfile(context: vscode.ExtensionContext): UpCloudProfile | undefined {
    return context.globalState.get('SelectedUpCloudProfile');
  }

  public static async ClearCurrentSession(context: vscode.ExtensionContext): Promise<void> {
    await context.globalState.update("SelectedUpCloudProfile", undefined);
    await context.globalState.update("UpCloud.CurrentObjectStorages", undefined);
    await context.globalState.update("UpCloud.TempKeys", undefined);
  }
}