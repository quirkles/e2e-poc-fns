import { firestore } from "firebase-admin";
import { user } from "firebase-functions/v1/auth";
import { v4 } from "uuid";

import { getFirestore } from "../../utils/firestore.js";
import { createLogger } from "../../utils/logger/Logger.pino.js";

import Timestamp = firestore.Timestamp;

export const onUserCreate = user().onCreate(async (userRecord) => {
  const logger = createLogger({
    logName: "onUserCreate",
    labels: {
      executionId: v4(),
      userId: userRecord.uid,
    },
  });
  logger.info("User created", { user: userRecord });

  const firestore = getFirestore();
  await firestore
    .collection("users")
    .doc(userRecord.uid)
    .set({
      email: userRecord.email ?? null,
      displayName: userRecord.displayName ?? null,
      photoURL: userRecord.photoURL ?? null,
      createdAt: Timestamp.now(),
      role: "user",
    });

  logger.info("User document created in Firestore");
});
