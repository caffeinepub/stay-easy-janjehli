import { HttpAgent } from "@dfinity/agent";
import { useCallback, useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";
import { useInternetIdentity } from "./useInternetIdentity";

const _MOTOKO_DEDUPLICATION_SENTINEL = "!caf!";

export function useUploadFile() {
  const { identity } = useInternetIdentity();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const uploadFile = useCallback(
    async (file: File, onProgress?: (pct: number) => void): Promise<string> => {
      const config = await loadConfig();
      const agent = new HttpAgent({
        host: config.backend_host,
        identity: identity ?? undefined,
      });
      if (config.backend_host?.includes("localhost")) {
        await agent.fetchRootKey().catch(() => {});
      }
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      setUploadProgress(0);
      const { hash } = await storageClient.putFile(bytes, (pct) => {
        const rounded = Math.round(pct * 100);
        setUploadProgress(rounded);
        onProgress?.(rounded);
      });
      const directUrl = await storageClient.getDirectURL(hash);
      setUploadProgress(null);
      return directUrl;
    },
    [identity],
  );

  return { uploadFile, uploadProgress, setUploadProgress };
}
