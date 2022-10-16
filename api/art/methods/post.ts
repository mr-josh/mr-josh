import artTableClient, { ArtEntity } from "../db.js";

import { HttpRequest } from "@azure/functions";
import artStorageClient from "../blob.js";
import { fileTypeFromBuffer } from "file-type";
import { randomUUID } from "crypto";

interface ArtBody {
  title: string;
  creator: string;
  socials: string[];
  data: string;
}

const postRequest = async (req: HttpRequest) => {
  const settings = await artTableClient.getEntity("settings", "fan-art");

  // Are uploads currently allowed
  if (!settings.allowUploads) {
    return {
      status: 403,
      body: "Uploads are currently disabled",
    };
  }

  // Are uploads going unnoticed, if so then limit after a certain amount
  const unpublishedEntities = await artTableClient
    .listEntities({ queryOptions: { filter: "published eq false" } })
    .byPage({ maxPageSize: +settings.maxUnpublishedQueue || 100 })
    .next();

  if (unpublishedEntities.value.length >= +settings.maxUnpublishedQueue) {
    return {
      status: 403,
      body: "The queue is currently full",
    };
  }

  let entity: ArtEntity;

  try {
    const { title, creator, socials, data }: ArtBody = req.body;

    if (!title || !creator || !socials || !data) {
      throw Error("Missing required fields");
    }

    if (socials.length > 3) {
      throw Error("Too many socials");
    }

    const artBuffer = Buffer.from(data, "base64");

    const { ext, mime } = await fileTypeFromBuffer(artBuffer);

    if (!ext || !mime) {
      throw Error("Invalid file type");
    }

    const blobName = `${randomUUID()}.${ext}`;
    const blobClient = artStorageClient.getBlockBlobClient(
      `fan-art/${blobName}`
    );
    await blobClient.upload(artBuffer, artBuffer.length, {
      tags: { title, creator },
      blobHTTPHeaders: {
        blobContentType: mime,
      },
    });

    entity = {
      partitionKey: "fan-art",
      rowKey: randomUUID(),
      title,
      creator,
      socials: socials.join(","),
      url: blobClient.url,
    };
  } catch (e) {
    console.error(e);

    return {
      status: 400,
      body: `Body is invalid. Reason:\n${e.message || "Unknown"}`,
    };
  }

  await artTableClient.createEntity({
    ...entity,
    published: false,
  });

  return {
    status: 200,
    body: "Success",
  };
};

export default postRequest;
