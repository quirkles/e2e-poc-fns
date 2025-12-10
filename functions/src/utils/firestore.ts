import { initializeApp, App } from "firebase-admin/app";
import { Auth, getAuth as fbAuth } from "firebase-admin/auth";
import {
  Firestore,
  getFirestore as fbFirestore,
} from "firebase-admin/firestore";
import { Storage, getStorage as fbStorage } from "firebase-admin/storage";

let firebase: App | null = null;

export const getFirebase = (): App => {
  firebase ??= initializeApp();
  return firebase;
};

let firestore: Firestore | null = null;
export const getFirestore = (): Firestore => {
  if (!firebase) {
    getFirebase();
  }
  firestore ??= fbFirestore();
  return firestore;
};

let storage: Storage | null = null;
export const getStorage = (): Storage => {
  if (!firebase) {
    getFirebase();
  }
  storage ??= fbStorage();
  return storage;
};

let auth: Auth | null = null;
export const getAuth = (): Auth => {
  if (!firebase) {
    getFirebase();
  }
  auth ??= fbAuth();
  return auth;
};

export function initFbApp() {
  getFirebase();
}
