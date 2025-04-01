import { UpCloudProfile, ObjectStorageConfig } from '../common/UpCloudTypes';

export async function fetchObjectStorages(profile: UpCloudProfile): Promise<ObjectStorageConfig[]> {
  const authHeader = "Basic " + Buffer.from(`${profile.username}:${profile.password}`).toString("base64");

  const response = await fetch("https://api.upcloud.com/1.3/object-storage-2", {
    method: "GET",
    headers: {
      "Authorization": authHeader,
      "Accept": "application/json",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest"
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