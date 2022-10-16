import artTableClient, { ArtEntity } from "../db.js";

import { HttpRequest } from "@azure/functions";

const getRequest = async (req: HttpRequest) => {
  const limit = +req.query.limit || 10;
  const page = req.query.page || null;

  const publishedEntities = await artTableClient
    .listEntities({ queryOptions: { filter: "published eq true" } })
    .byPage({
      maxPageSize: limit,
      continuationToken: page,
    })
    .next();

  return {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      publishedEntities.value.map((art: ArtEntity) => ({
        id: art.rowKey,
        title: art.title,
        creator: art.creator,
        socials: art.socials.split(","),
        url: art.url,
      }))
    ),
  };
};

export default getRequest;
