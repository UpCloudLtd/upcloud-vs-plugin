import { UpCloudProfile, ObjectStorageConfig } from '../common/UpCloudTypes';
import { UpCloudProfileManager } from './UpCloudProfileManager';
import * as vscode from 'vscode';
import { getPluginUserAgent } from '../common/VersionUtils';

interface KubernetesCluster {
  name: string;
  uuid: string;
}

interface KubernetesClusterResponse {
  kubernetes_clusters: KubernetesCluster[];
}

export async function fetchObjectStorages(profile: UpCloudProfile): Promise<ObjectStorageConfig[]> {
  const authHeader = "Basic " + Buffer.from(`${profile.username}:${profile.password}`).toString("base64");

  const response = await fetch("https://api.upcloud.com/1.3/object-storage-2", {
    method: "GET",
    headers: {
      "Authorization": authHeader,
      "Accept": "application/json",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent": getPluginUserAgent(),
    },
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`UpCloud API error: ${response.statusText} - ${msg}`);
  }

  const body = await response.json() as any[];;
  console.log('[DEBUG] UpCloud object storage raw response:', JSON.stringify(body, null, 2));
  return body.map((storage: any) => {
    const publicEndpoint = storage.endpoints?.find((e: any) => e.type === 'public')?.domain_name || '';

    return {
      name: storage.name,
      endpoint: publicEndpoint,
      service_uuid: storage.uuid,
    };
  });
}

export async function fetchClusters(context: vscode.ExtensionContext) {
  const profile = UpCloudProfileManager.GetSelectedProfile(context);
  if (!profile) throw new Error("No profile selected");

  try {
    // Fetch the list of Kubernetes clusters
    const response = await fetch("https://api.upcloud.com/1.3/kubernetes", {
      headers: {
        "Authorization": "Basic " + Buffer.from(`${profile.username}:${profile.password}`).toString("base64"),
        "Content-Type": "application/json",
        "User-Agent": getPluginUserAgent(),
      }
    });

    const responseBody = await response.text();

    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = JSON.parse(responseBody);

    // If the response is an array, map it directly
    if (Array.isArray(data)) {
        return data.map((c: any) => ({ name: c.name, uuid: c.uuid }));
    }

    // If the response is not an array, log the unexpected format
    vscode.window.showErrorMessage("Unexpected API response format.");
    return [];
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error fetching data: ${error.message}`);
    return [];
  }
}

export async function fetchKubeconfig(context: vscode.ExtensionContext, uuid: string) {
  const profile = UpCloudProfileManager.GetSelectedProfile(context);
  if (!profile) throw new Error("No profile selected");

  try {
    // Fetch the kubeconfig for the specified cluster UUID
    const response = await fetch(`https://api.upcloud.com/1.3/kubernetes/${uuid}/kubeconfig`, {
      headers: {
        "Authorization": "Basic " + Buffer.from(`${profile.username}:${profile.password}`).toString("base64"),
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": getPluginUserAgent(),
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const rawText = await response.text();

    // 👇 parse manually and access kubeconfig defensively
    const parsed = JSON.parse(rawText);
    const kubeconfig = parsed.kubeconfig;

    if (typeof kubeconfig !== 'string') {
      throw new Error("Invalid kubeconfig format");
    }

    return kubeconfig;
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error fetching data: ${error.message}`);
    return "";
  }    
}