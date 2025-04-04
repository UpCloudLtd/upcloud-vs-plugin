import * as vscode from 'vscode';
import { UpCloudProfileManager } from '../upcloud/UpCloudProfileManager';
import { fetchClusters, fetchObjectStorages } from '../upcloud/UpCloudAPI';
import { TreeItemType, TypedTreeItem } from './TreeItemTypes';
import { ObjectStorageConfig } from '../common/UpCloudTypes';
import {
  ListBucketsCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { UpCloudKeyManager } from '../upcloud/UpCloudKeyManager';
import { S3TreeItem } from './S3TreeItem';
import { S3TreeItemType } from './S3TreeItem';
import { getPluginUserAgent } from '../common/VersionUtils';

export class UpCloudTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | void> = new vscode.EventEmitter();
  readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | void> = this._onDidChangeTreeData.event;
  public static ActiveS3Client?: S3Client;
  private objectStorages: ObjectStorageConfig[] = [];

  constructor(private context: vscode.ExtensionContext) {}

  refresh(element?: vscode.TreeItem): void {
    this._onDidChangeTreeData.fire(element);
  }

  async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
    const profile = UpCloudProfileManager.GetSelectedProfile(this.context);

    if (!profile) {
      const loginItem = new TypedTreeItem("Please log in", TreeItemType.Message);
      loginItem.command = {
        command: 'UpCloudTreeView.Login',
        title: 'Log in',
        arguments: [],
      };
      return [loginItem];
    }
    
    if (!element) {
      return [
        new TypedTreeItem('Object Storages', TreeItemType.RootObjectStorages),
        new TypedTreeItem('Kubernetes Clusters', TreeItemType.RootKubernetes)
      ];
    }

    const typedElement = element as TypedTreeItem;

    if (typedElement.type === TreeItemType.RootObjectStorages) {
      const profile = UpCloudProfileManager.GetSelectedProfile(this.context);
      if (!profile) {
        vscode.window.showWarningMessage('No UpCloud profile selected.');
        return [];
      }

      try {
        this.objectStorages = await fetchObjectStorages(profile);
        return this.objectStorages.map(storage => new TypedTreeItem(storage.name, TreeItemType.ObjectStorage, storage));
      } catch (err: any) {
        vscode.window.showErrorMessage(`Failed to fetch object storages: ${err.message}`);
        return [];
      }
    }

    if (typedElement.type === TreeItemType.ObjectStorage) {
      const storage = typedElement.data as ObjectStorageConfig;

      const updatedStorage = await UpCloudKeyManager.GetStorageKeys(this.context, storage);

      if (!updatedStorage) {
        return [];
      }

      try {
        const s3 = new S3Client({
          endpoint: `https://${updatedStorage.endpoint}`,
          forcePathStyle: true,
          region: 'auto',
          customUserAgent: getPluginUserAgent(),
          credentials: {
            accessKeyId: updatedStorage.accessKeyId!,
            secretAccessKey: updatedStorage.secretAccessKey!,
          },
        });

        UpCloudTreeDataProvider.ActiveS3Client = s3;

        const command = new ListBucketsCommand({});
        const response = await s3.send(command);

        if (!response.Buckets) return [];

        return response.Buckets.map(bucket => {
          const bucketName = bucket.Name ?? '(no-name)';
          const bucketItem = new S3TreeItem(bucketName, S3TreeItemType.Bucket, {
            ...updatedStorage,
            bucketName,
          });
        
          bucketItem.Bucket = bucket.Name || '(no-name)';
          bucketItem.s3Client = s3;
        
          bucketItem.command = {
            command: 'UpCloudTreeView.OpenExplorerFromUpCloudBucket',
            title: 'Open Bucket in Explorer',
            arguments: [bucketItem],
          };
        
          return bucketItem;
        });
      } catch (err: any) {
        vscode.window.showErrorMessage(`Failed to fetch buckets for ${storage.name}: ${err.message}`);
        return [];
      }
    }
    if (typedElement.type === TreeItemType.RootKubernetes) {
      try {
        const clusters = await fetchClusters(this.context);
        return clusters.map((cluster: any) => {
          const item = new TypedTreeItem(cluster.name, TreeItemType.KubernetesCluster, cluster);
          item.command = {
            command: 'UpCloudTreeView.getKubeconfig',
            title: 'Get Kubeconfig',
            arguments: [cluster.uuid]
          };
          return item;
        });
      } catch (err: any) {
        vscode.window.showErrorMessage(`Failed to fetch clusters: ${err.message}`);
        return [];
      }
    }

    return [];
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }
}
