import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import getRequest from "./methods/get.js";
import postRequest from "./methods/post.js";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  let response: any;

  if (req.method === "GET") response = await getRequest(req);
  if (req.method === "POST") response = await postRequest(req);

  context.res = response;
};

export default httpTrigger;
