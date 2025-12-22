import { user } from "firebase-functions/v1/auth";
import { v4 } from "uuid";

import { createLogger } from "../../utils/logger/Logger.pino.js";

export const onUserCreate = user().onCreate((user) => {
  const logger = createLogger({
    logName: "onUserCreate",
    labels: {
      executionId: v4(),
      userId: user.uid,
    },
  });
  logger.info("User created", { user });
});
