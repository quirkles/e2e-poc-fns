import { z } from "zod";

import { httpHandler } from "../../utils/wrappers/httpFunctionWrapper.js";
import { getLogger } from "../../utils/wrappers/index.js";
import { HttpHandlerFunction } from "../../utils/wrappers/types.js";

const bodySchema = z.object({
  email: z.email(),
});

const functionConfig = {
  useAppCheck: true,
  bodySchema,
} as const;

const inviteUserHandler: HttpHandlerFunction<typeof functionConfig> = ({
  body,
  appCheckTokenResponse,
}) => {
  const logger = getLogger();
  logger.info("inviteUserHandler: begin", {
    body,
    appCheckTokenResponse,
  });
  return {
    statusCode: 200,
  };
};

export const inviteUser = httpHandler(inviteUserHandler, functionConfig);
