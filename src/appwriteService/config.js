import { Client, Databases, Query } from 'appwrite';
import {  appwriteMealsCollectionId, appWriteDbId, appWriteProjectId, appWriteURL } from "../conf/conf.js";

const DATABASE_ID = appWriteDbId;
const COLLECTION_ID = appwriteMealsCollectionId;

const client = new Client()
  .setEndpoint(appWriteURL)
  .setProject(appWriteProjectId);

export const databases = new Databases(client);

export const fetchMealSuggestions = async (query) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.search('Recipe-Name', query)]
    );
    return response.documents || [];
  } catch (error) {
    throw new Error('Error fetching meal suggestions:', error);
  }
};

export const getRandomMeal = async () => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(100)]);
    const randomIndex = Math.floor(Math.random() * response.documents.length);

    if (response.documents.length === 0) {
      throw new Error('No meals available.');
    }

    return response.documents[randomIndex];
  } catch (error) {
    throw error;
  }
};

export const getCategoriesAndDocuments = async () => {
  const LIMIT = 100;
  const categoriesSet = new Set();
  const allDocuments = [];
  let offset = 0;
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.limit(LIMIT), Query.offset(offset)]
      );

      if (response.documents.length === 0) {
        hasMore = false;
      } else {
        response.documents.forEach(doc => {
          allDocuments.push(doc); 

          if (doc.Category) {
            categoriesSet.add(doc.Category);
          }
        });

        offset += LIMIT;
      }
    }

    return {
      allDocuments,  
      categories: Array.from(categoriesSet) 
    };
  } catch (error) {
    throw error;
  }
};

export const fetchNightMeals = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.limit(15), Query.offset(30)]
    );
    return response.documents;
  } catch (error) {
    throw error;
  }
};

export const getDocumentById = async (docId) => {
  try {
    const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, docId);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getItemsByCategory = async (category) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal('Category', category)]
    );
    return response.documents;
  } catch (error) {
    throw error;
  }
};

export const getMealsByArea = async (area) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal('Area', area)]
    );
    return response.documents;
  } catch (error) {
    throw error;
  }
};

export const getLatest = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.limit(15), Query.orderDesc('$createdAt')]
    );
    return response.documents;
  } catch (error) {
    throw error;
  }
};

export const getQuickRecipe = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.limit(15), Query.offset(125)]
    );
    return response.documents;
  } catch (error) {
    throw error;
  }
};

export const getTasty = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.limit(15), Query.offset(225)]
    );
    return response.documents;
  } catch (error) {
    throw error;
  }
};

export const getDocumentsByLikes = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.orderDesc('Likes')
      ]
    );

    return response.documents;
  } catch (error) {
    throw error;
  }
};



