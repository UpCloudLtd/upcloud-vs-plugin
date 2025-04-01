import * as vscode from 'vscode';
import * as ui from './common/UI';
import { S3TreeView } from './s3/S3TreeView';
import { S3TreeItem } from './s3/S3TreeItem';
import { UpCloudProfileForm } from './upcloud/UpCloudProfileForm';
import { UpCloudProfileManager } from './upcloud/UpCloudProfileManager';
import { UpCloudTreeDataProvider } from './s3/UpCloudTreeDataProvider';
import { UpCloudKeyForm } from './upcloud/UpCloudKeyForm';

export function activate(context: vscode.ExtensionContext) {
	ui.logToOutput('Aws S3 Extension activation started');

	let treeView:S3TreeView = new S3TreeView(context);

	vscode.commands.registerCommand('S3TreeView.Refresh', () => {
		treeView.Refresh();
	});

	vscode.commands.registerCommand('S3TreeView.Filter', () => {
		treeView.Filter();
	});

	vscode.commands.registerCommand('S3TreeView.ShowOnlyFavorite', () => {
		treeView.ShowOnlyFavorite();
	});

	vscode.commands.registerCommand('S3TreeView.ShowHiddenNodes', () => {
		treeView.ShowHiddenNodes();
	});

	vscode.commands.registerCommand('S3TreeView.AddToFav', (node: S3TreeItem) => {
		treeView.AddToFav(node);
	});

	vscode.commands.registerCommand('S3TreeView.DeleteFromFav', (node: S3TreeItem) => {
		treeView.DeleteFromFav(node);
	});

	vscode.commands.registerCommand('S3TreeView.HideNode', (node: S3TreeItem) => {
		treeView.HideNode(node);
	});

	vscode.commands.registerCommand('S3TreeView.UnHideNode', (node: S3TreeItem) => {
		treeView.UnHideNode(node);
	});

	vscode.commands.registerCommand('S3TreeView.ShowOnlyInThisProfile', (node: S3TreeItem) => {
		treeView.ShowOnlyInThisProfile(node);
	});

	vscode.commands.registerCommand('S3TreeView.ShowInAnyProfile', (node: S3TreeItem) => {
		treeView.ShowInAnyProfile(node);
	});

	vscode.commands.registerCommand('S3TreeView.AddBucket', () => {
		treeView.AddBucket();
	});

	vscode.commands.registerCommand('S3TreeView.RemoveBucket', (node: S3TreeItem) => {
		treeView.RemoveBucket(node);
	});

	vscode.commands.registerCommand('S3TreeView.Goto', (node: S3TreeItem) => {
		treeView.Goto(node);
	});

	vscode.commands.registerCommand('S3TreeView.RemoveShortcut', (node: S3TreeItem) => {
		treeView.RemoveShortcut(node);
	});

	vscode.commands.registerCommand('S3TreeView.AddShortcut', (node: S3TreeItem) => {
		treeView.AddShortcut(node);
	});

	vscode.commands.registerCommand('S3TreeView.CopyShortcut', (node: S3TreeItem) => {
		treeView.CopyShortcut(node);
	});

	vscode.commands.registerCommand('S3TreeView.ShowS3Explorer', (node: S3TreeItem) => {
		treeView.ShowS3Explorer(node);
	});

	vscode.commands.registerCommand('S3TreeView.ShowS3Search', (node: S3TreeItem) => {
		treeView.ShowS3Search(node);
	});

	vscode.commands.registerCommand('S3TreeView.SelectAwsProfile', (node: S3TreeItem) => {
		treeView.SelectAwsProfile(node);
	});

	vscode.commands.registerCommand('S3TreeView.UpdateAwsEndPoint', () => {
		treeView.UpdateAwsEndPoint();
	});

	vscode.commands.registerCommand('S3TreeView.SetAwsRegion', () => {
		treeView.SetAwsRegion();
	});

	vscode.commands.registerCommand('S3TreeView.TestAwsConnection', () => {
		treeView.TestAwsConnection();
	});

	vscode.commands.registerCommand('S3TreeView.SelectProfile', () => {
		treeView.SelectS3Profile();
	});

	vscode.commands.registerCommand('S3TreeView.AddProfile', () => {
		treeView.AddS3Profile();
	});

	vscode.commands.registerCommand('S3TreeView.AddUpCloudProfile', () => {
		UpCloudProfileForm.Show(context);
	});

	vscode.commands.registerCommand('S3TreeView.SelectUpCloudProfile', async () => {
		await UpCloudProfileManager.SelectProfile(context);
	});

	vscode.commands.registerCommand('S3TreeView.EnterKeysForStorage', (storage) => {
		UpCloudKeyForm.Show(context, storage);
	  });
	  
	  vscode.commands.registerCommand('UpCloudTreeView.Refresh', () => {
		upCloudTreeProvider.refresh();
	  });

	const upCloudTreeProvider = new UpCloudTreeDataProvider(context);
	vscode.window.createTreeView('UpCloudTreeView', {
	  treeDataProvider: upCloudTreeProvider,
	  showCollapseAll: true,
	});

	vscode.commands.registerCommand('S3TreeView.OpenExplorerFromUpCloudBucket', (item: S3TreeItem) => {
		console.log('Command triggered, client exists =', !!item.s3Client);
	  
		// ✅ Now you have the real instance, just pass it along
		const S3Explorer = require('./s3/S3Explorer'); // or `import` if it's available
		S3Explorer.S3Explorer.Render(context.extensionUri, item);
	  });

	ui.logToOutput('Aws S3 Extension activation completed');
}

export function deactivate() {
	ui.logToOutput('Aws S3 is now de-active!');
}
