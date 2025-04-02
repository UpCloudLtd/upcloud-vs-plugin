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
  }
}
