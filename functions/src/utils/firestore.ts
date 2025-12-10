import * as admin from "firebase-admin";

let firebase: admin.app.App | null = null;

export const getFirebase = (): admin.app.App => {
  firebase ??= admin.initializeApp();
  return firebase;
};

let firestore: admin.firestore.Firestore | null = null;
export const getFirestore = (): admin.firestore.Firestore => {
  if (!firebase) {
    getFirebase();
  }
  firestore ??= admin.firestore();
  return firestore;
};

let storage: admin.storage.Storage | null = null;
export const getStorage = (): admin.storage.Storage => {
  if (!firebase) {
    getFirebase();
  }
  storage ??= admin.storage();
  return storage;
};

let database: admin.database.Database | null = null;
export const getRealtimeDB = (): admin.database.Database => {
  if (!firebase) {
    getFirebase();
  }
  database ??= admin.database();
  return database;
};

let auth: admin.auth.Auth | null = null;
export const getAuth = (): admin.auth.Auth => {
  if (!firebase) {
    getFirebase();
  }
  auth ??= admin.auth();
  return auth;
};

export function initFbApp() {
  getFirebase();
}
