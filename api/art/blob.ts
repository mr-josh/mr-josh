import { ContainerClient } from "@azure/storage-blob";

const connectionString = process.env["MJDATA_CONNSTR"];

const artStorageClient = new ContainerClient(connectionString, "art");

export default artStorageClient;
