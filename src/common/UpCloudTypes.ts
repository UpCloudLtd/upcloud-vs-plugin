export interface UpCloudProfile {
    name: string;
    username: string;
    password: string;
  }
  
  export interface ObjectStorageConfig {
    name: string;
    service_uuid: string;
    endpoint: string;
    accessKeyId?: string;
    secretAccessKey?: string;
  }
  