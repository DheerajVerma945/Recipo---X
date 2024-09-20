const appWriteURL = String(import.meta.env.VITE_APPWRITE_URL);
const appWriteProjectId = String(import.meta.env.VITE_APPWRITE_PROJECT_IDL);
const appWriteDbId = String(import.meta.env.VITE_APPWRITE_DATABASE_ID);
const appWriteUserCollectionId = String(import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID);
const appWritePostBucketId = String(import.meta.env.VITE_APPWRITE_MEAL_BUCKET_ID);
const appWriteProfileBucketId = String(import.meta.env.VITE_APPWRITE_USER_BUCKET_ID)
const appwriteMealsCollectionId = String(import.meta.env.VITE_APPWRITE_MEALS_COLLECTION_ID );



export { appWritePostBucketId,appWriteProfileBucketId, appWriteUserCollectionId,appwriteMealsCollectionId, appWriteDbId, appWriteProjectId, appWriteURL }