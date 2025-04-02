import * as vscode from 'vscode';

export enum TreeItemType {
  RootObjectStorages = "RootObjectStorages",
  ObjectStorage = "ObjectStorage",
  Bucket = "Bucket",
  Message = "Message"
}

export class TypedTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly type: TreeItemType,
    public readonly data?: any,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
  ) {
    super(label, collapsibleState);
    this.contextValue = type;

    if (type === TreeItemType.ObjectStorage) {
      this.command = {
        command: 'UpCloudTreeView.RefreshObjectStorage',
        title: 'Refresh',
        arguments: [this],
      };

      this.iconPath = new vscode.ThemeIcon('cloud');
    }
  }
}
