import { Client, Storage, Databases, Query } from 'appwrite';
import imageCompression from "browser-image-compression"
import { appwriteMealsCollectionId, appWriteProjectId, appWriteUserCollectionId, appWritePostBucketId, appWriteURL, appWriteDbId, appWriteProfileBucketId } from "../conf/conf.js"

const client = new Client()
    .setEndpoint(appWriteURL)
    .setProject(appWriteProjectId);


const storage = new Storage(client);
const databases = new Databases(client);

const postBucketId = appWritePostBucketId;
const profileBucketId = appWriteProfileBucketId;
const databaseId = appWriteDbId;
const MealcollectionId = appwriteMealsCollectionId;
const userCollectionId = appWriteUserCollectionId;


export const uploadFileAndGetUrl = async (file) => {
    try {
        const options = {
            maxSizeMB: 1,
            useWebWorker: true,
        };
        const compressedBlob = await imageCompression(file, options);

        const compressedFile = new File([compressedBlob], file.name, {
            type: file.type,
            lastModified: Date.now(),
        });
        const uploadResponse = await storage.createFile(postBucketId, 'unique()', compressedFile);

        const fileId = uploadResponse.$id;

        const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${postBucketId}/files/${fileId}/view?project=66e0247700088525a3cf`;

        return fileUrl;
    } catch (error) {
        throw error;
    }
};

export const createDocument = async ({ mealName, recipe, ingredients, image, area, category, youtubeLink, user }) => {
    try {
        const documentData = {
            'Recipe-Name': mealName,
            'Recipe': recipe,
            'Ingredients': ingredients,
            'Area': area,
            'Category': category,
            'PostedBy': user.name,
            'userId': user.$id,
            'PostedDate': new Date().toISOString(),
        };

        if (image) {
            documentData.Image = image;
        }
        if (youtubeLink) {
            documentData.YouTube = youtubeLink;
        }

        const response = await databases.createDocument(databaseId, MealcollectionId, 'unique()', documentData);
        return response.$id;
    } catch (error) {
        throw error;
    }
};


export const createUserDoc = async (id, name) => {
    try {
        const data = {
            Favourites: [],
            Bio: '',
            LikedPost: [],
            Posted: [],
            userId: id,
            userName: name,
        }
        const response = await databases.createDocument(databaseId, userCollectionId, 'unique()', data);
        return response;
    } catch (error) {
        throw error;
    }
}

export const getUserDoc = async (userId) => {
    try {
        const userDocs = await databases.listDocuments(databaseId, userCollectionId, [Query.equal('userId', userId)]);

        const userDoc = userDocs.documents[0];
        return userDoc;
    } catch (error) {
        throw error;
    }
}
export const incrementLike = async (docId, currLikes, userId) => {
    try {

        const userDocs = await databases.listDocuments(databaseId, userCollectionId, [Query.equal('userId', userId)]);
        const userDoc = userDocs.documents[0];


        const response = await databases.updateDocument(databaseId, MealcollectionId, docId, {
            'Likes': currLikes + 1
        });

        const updatedUserDoc = await databases.updateDocument(databaseId, userCollectionId, userDoc.$id, {
            'LikedPost': [...userDoc.LikedPost, docId]
        });
    }
    catch (error) {
        throw error;
    }
}

export const decrementLike = async (docId, currLikes, userId) => {
    try {
        const userDocs = await databases.listDocuments(databaseId, userCollectionId, [Query.equal('userId', userId)]);

        const userDoc = userDocs.documents[0];
        const response = await databases.updateDocument(databaseId, MealcollectionId, docId, {
            'Likes': currLikes - 1
        });

        const updatedUserDoc = await databases.updateDocument(databaseId, userCollectionId, userDoc.$id, {
            'LikedPost': userDoc.LikedPost.filter(postId => postId !== docId)
        });

    }
    catch (error) {
        throw error;
    }
}

export const addFavourite = async (userId, docId) => {
    try {
        const userDocs = await databases.listDocuments(databaseId, userCollectionId, [Query.equal('userId', userId)]);
        const userDoc = userDocs.documents[0];
        const updatedFavourites = [...userDoc.Favourites, docId];
        const response = await databases.updateDocument(databaseId, userCollectionId, userDoc.$id, {
            Favourites: updatedFavourites
        });

    }
    catch (error) {
        throw error;
    }
}

export const removeFavourite = async (userId, docId) => {
    try {
        const userDocs = await databases.listDocuments(databaseId, userCollectionId, [Query.equal('userId', userId)]);

        const userDoc = userDocs.documents[0];

        if (userDoc.Favourites.includes(docId)) {
            const updatedFavourites = userDoc.Favourites.filter(favId => favId !== docId);
            const response = await databases.updateDocument(databaseId, userCollectionId, userDoc.$id, {
                Favourites: updatedFavourites
            });
        }
    }
    catch (error) {
        throw error;
    }
}
export const getFavourites = async (userId) => {
    try {
        const userDocs = await databases.listDocuments(databaseId, userCollectionId, [Query.equal('userId', userId)]);
        const userDoc = userDocs.documents[0];
        const favourites = userDoc.Favourites;
        return favourites;
    } catch (error) {
        throw error;
    }

}
export const getMyPosts = async (userId) => {
    try {
        const userDocs = await databases.listDocuments(databaseId, userCollectionId, [Query.equal('userId', userId)]);
        const userDoc = userDocs.documents[0];
        const posted = userDoc.Posted;
        return posted;
    } catch (error) {
        throw error;
    }
}

export const getLikedPosts = async (userId) => {
    try {
        const userDocs = await databases.listDocuments(databaseId, userCollectionId, [Query.equal('userId', userId)]);
        const userDoc = userDocs.documents[0];
        const liked = userDoc?.LikedPost || [];
        return liked;
    } catch (error) {
        throw error;
    }

}
export const clearLikedPosts = async (userId) => {
    try {
        const userDocs = await databases.listDocuments(databaseId, userCollectionId, [Query.equal('userId', userId)]);
        const userDoc = userDocs.documents[0];
        await databases.updateDocument(databaseId, userCollectionId, userDoc.$id, { LikedPost: [] });

    } catch (error) {
        throw error;
    }

}

export const clearFavourites = async (userId) => {
    try {
        const userDocs = await databases.listDocuments(databaseId, userCollectionId, [Query.equal('userId', userId)]);
        const userDoc = userDocs.documents[0];
        await databases.updateDocument(databaseId, userCollectionId, userDoc.$id, { Favourites: [] });

    } catch (error) {
        throw error;
    }

}

export const uploadDpAndGetUrl = async (file) => {
    try {
        const options = {
            maxSizeMB: 1,
            useWebWorker: true,
        };
        const compressedBlob = await imageCompression(file, options);

        const compressedFile = new File([compressedBlob], file.name, {
            type: file.type,
            lastModified: Date.now(),
        });
        const uploadResponse = await storage.createFile(profileBucketId, 'unique()', compressedFile);

        const fileId = uploadResponse.$id;

        const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${profileBucketId}/files/${fileId}/view?project=66e0247700088525a3cf`;

        return fileUrl;
    } catch (error) {
        throw error;
    }
};

export const updateDp = async (userId, url) => {
    try {
        const profileDocs = await databases.listDocuments(databaseId, userCollectionId, [Query.equal('userId', userId)]);
        const profile = profileDocs.documents[0];
        await databases.updateDocument(databaseId, userCollectionId, profile.$id, { Dp: url });
    } catch (error) {
        throw error;
    }
}

export const updateBio = async (userId, data) => {
    try {
        const docs = await databases.listDocuments(databaseId, userCollectionId, [Query.equal('userId', userId)]);
        const doc = docs.documents[0];
        await databases.updateDocument(databaseId, userCollectionId, doc.$id, { Bio: data });
    } catch (error) {
        throw error;
    }
}


export const addPost = async (userId, postId) => {
    try {
        const docs = await databases.listDocuments(databaseId, userCollectionId, [Query.equal('userId', userId)]);
        const doc = docs.documents[0];
        const updatedPosted = [...doc.Posted, postId];
        await databases.updateDocument(databaseId, userCollectionId, doc.$id, { Posted: updatedPosted });
    } catch (error) {
        throw error;
    }
}

export const updatePost = async (docId, updatedDoc) => {
    try {
        const doc = await databases.getDocument(databaseId, MealcollectionId, docId);
        const updatedPost = { ...doc, ...updatedDoc };
        const { $databaseId, $collectionId, $id, $permissions, $createdAt, ...fieldsToUpdate } = updatedPost;
        await databases.updateDocument(databaseId, MealcollectionId, docId, fieldsToUpdate);
    }
    catch (error) {
        throw error;
    }
}

export const deletePost = async (docId, userId) => {
    try {
        const response = await databases.deleteDocument(databaseId, MealcollectionId, docId);
        const userDocs = await databases.listDocuments(databaseId, userCollectionId, [Query.equal('userId', userId)]);
        const userDoc = userDocs.documents[0];
        const posted = userDoc.Posted;
        const updatedPosted = posted.filter((id) => id !== docId);
        await databases.updateDocument(databaseId, userCollectionId, userDoc.$id, { Posted: updatedPosted });
    }
    catch (error) {
        throw error;
    }
}

export const userPosts = async (Id) => {
    const LIMIT = 100;
    const allDocuments = [];
    let offset = 0;
    let hasMore = true;

    try {
        while (hasMore) {
            const response = await databases.listDocuments(
                databaseId,
                MealcollectionId,
                [Query.equal("userId", Id), Query.limit(LIMIT), Query.offset(offset)]
            );

            if (response.documents.length === 0) {
                hasMore = false;
            } else {
                response.documents.forEach(doc => {
                    allDocuments.push(doc);
                });

                offset += LIMIT;
            }
        }
        return allDocuments;
    } catch (error) {
        throw error;
    }
};


