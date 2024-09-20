import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchMealSuggestions,
    getDocumentById,
    getRandomMeal,
    getItemsByCategory,
    getMealsByArea,
    getCategoriesAndDocuments
} from '../appwriteService/config';


export const fetchCategoriesandDoc = createAsyncThunk('categories/fetchCategories', async () => {
    return await getCategoriesAndDocuments();
});


export const fetchMealSuggestionsThunk = createAsyncThunk('config/fetchMealSuggestions', async (query) => {
    return await fetchMealSuggestions(query);
});



export const getDocumentByIdThunk = createAsyncThunk('config/getDocumentById', async (docId) => {
    return await getDocumentById(docId);
});

export const getRandomMealThunk = createAsyncThunk('config/getRandomMeal', async () => {
    return await getRandomMeal();
});

export const fetchItemsByCategory = createAsyncThunk('config/fetchItemsByCategory', async (category) => {
    return await getItemsByCategory(category);
});

export const getMealsByAreaThunk = createAsyncThunk('config/getMealsByArea', async (area) => {
    return await getMealsByArea(area);
});



const configSlice = createSlice({
    name: 'config',
    initialState: {
        mealSuggestions: [],
        document: null,
        randomMeal: null,
        categoryItems: [],
        mealsByArea: [],
        categoriesandDoc: {},
        status: 'idle',
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategoriesandDoc.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCategoriesandDoc.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categoriesandDoc = action.payload;
            })
            .addCase(fetchCategoriesandDoc.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(fetchMealSuggestionsThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMealSuggestionsThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.mealSuggestions = action.payload;
            })
            .addCase(fetchMealSuggestionsThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(getDocumentByIdThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getDocumentByIdThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.document = action.payload;
            })
            .addCase(getDocumentByIdThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getRandomMealThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.randomMeal = action.payload;
            })

            .addCase(fetchItemsByCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchItemsByCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categoryItems = action.payload;
            })
            .addCase(fetchItemsByCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(getMealsByAreaThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getMealsByAreaThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.mealsByArea = action.payload;
            })
            .addCase(getMealsByAreaThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
});

export default configSlice.reducer;
