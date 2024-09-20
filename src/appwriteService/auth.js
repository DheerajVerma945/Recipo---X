import { Client, Account, ID } from 'appwrite';
import { appWriteURL, appWriteProjectId } from "../conf/conf.js";

const client = new Client();
client.setEndpoint(appWriteURL)
    .setProject(appWriteProjectId)


const account = new Account(client);

export const signup = async (email, password, name) => {
    try {
        const userId = ID.unique();
        const response = await account.create(userId, email, password, name);

        try {
            const emailTokenResponse = await account.createEmailToken(userId, email);

            return { response, verified: false, userId };
        } catch (emailError) {
            return { response, verified: false, error: 'Failed to send verification email. Please check your email configuration.' };
        }
    } catch (error) {
        throw new Error('Signup failed. Please check the provided details and try again.');
    }
};

export const getUserById = async (userId) => {
    try {
        const response = await account.get(String(userId));
        return response;
    } catch (error) {
        throw new Error(error.message || 'Failed to fetch user data.');
    }
};

export const login = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        const userData = await account.get();

        if (!userData.emailVerification) {
            await account.deleteSession(session.$id);
            throw new Error('Please verify your email to log in.');
        }
        return { session };
    } catch (error) {
        throw new Error(error.message || 'Login failed.');
    }
};

export const verify = async(id,otp)=>{
    try {
    await account.createSession(id,otp);
    } catch (error) {
        throw error;
    }
}

export const checkSession = async () => {
    try {

        const session = await account.getSession('current');
        return session;
    } catch (error) {
        throw error;
    }
};


export const getAllSessions = async () => {
    try {
        const response = await account.listSessions();

        return response;
    } catch (error) {
        throw error;
    }
}

export const updatePassword = async (currPass, newPass) => {
    try {
        const response = await account.updatePassword(currPass, newPass);
        return response;

    } catch (error) {
        throw error;
    }
}



export const deleteAccount = async (id) => {
    try {
        const response = await account.delete();
    } catch (error) {
        throw error;
    }
}

export const logoutAll = async () => {
    try {
        const response = await account.deleteSessions();
    } catch (error) {
        throw error;
    }
}

export const user = async () => {
    try {
        const response = await account.get('current');
        return response;
    } catch (error) {
    }
}

export const logout = async () => {
    try {
        await account.deleteSession('current');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};


export const updateName = async (newName) => {
    try {
        await account.updateName(newName);
    } catch (error) {
        throw error;
    }
}





