export interface S3Profile {
    name: string;
    accessKeyId: string;
    secretAccessKey: string;
    region?: string;
    endpoint?: string;
  }