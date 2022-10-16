import { TableClient } from "@azure/data-tables";

const connectionString = process.env["MJDATA_CONNSTR"];

const artTableClient = TableClient.fromConnectionString(
  connectionString,
  "art"
);

export interface ArtEntity {
  partitionKey: string;
  rowKey: string;
  title: string;
  creator: string;
  socials: string;
  url: string;
}

export default artTableClient;
