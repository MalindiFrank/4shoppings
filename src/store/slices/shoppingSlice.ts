import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {
  ShoppingState,
  ShoppingList,
  ShoppingItem,
  Category,
  ShoppingListCreate,
  ShoppingListUpdate,
  ShoppingItemCreate,
  ShoppingItemUpdate,
} from '../../types';
import { shoppingListApi, shoppingItemApi, categoryApi } from '../../utils/api';
import { getCurrentUserId } from '../../utils/auth';

// Initial state
const initialState: ShoppingState = {
  lists: [],
  items: [],
  categories: [],
  currentList: null,
  loading: false,
  error: null,
};

// Async thunks for shopping lists
export const fetchShoppingLists = createAsyncThunk(
  'shopping/fetchLists',
  async (_, { rejectWithValue }) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const lists = await shoppingListApi.getLists(userId);
      return lists;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch shopping lists');
    }
  }
);

export const createShoppingList = createAsyncThunk(
  'shopping/createList',
  async (listData: ShoppingListCreate, { rejectWithValue }) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const newList = await shoppingListApi.createList(userId, listData);
      return newList;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create shopping list');
    }
  }
);

export const updateShoppingList = createAsyncThunk(
  'shopping/updateList',
  async ({ listId, updates }: { listId: string; updates: ShoppingListUpdate }, { rejectWithValue }) => {
    try {
      const updatedList = await shoppingListApi.updateList(listId, updates);
      return updatedList;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update shopping list');
    }
  }
);

export const deleteShoppingList = createAsyncThunk(
  'shopping/deleteList',
  async (listId: string, { rejectWithValue }) => {
    try {
      await shoppingListApi.deleteList(listId);
      return listId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete shopping list');
    }
  }
);

export const shareShoppingList = createAsyncThunk(
  'shopping/shareList',
  async ({ listId, userEmail }: { listId: string; userEmail: string }, { rejectWithValue }) => {
    try {
      const updatedList = await shoppingListApi.shareList(listId, userEmail);
      return updatedList;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to share shopping list');
    }
  }
);

// Async thunks for shopping items
export const fetchShoppingItems = createAsyncThunk(
  'shopping/fetchItems',
  async (listId: string, { rejectWithValue }) => {
    try {
      const items = await shoppingItemApi.getItems(listId);
      return { listId, items };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch shopping items');
    }
  }
);

export const createShoppingItem = createAsyncThunk(
  'shopping/createItem',
  async ({ listId, itemData }: { listId: string; itemData: ShoppingItemCreate }, { rejectWithValue }) => {
    try {
      const newItem = await shoppingItemApi.createItem(listId, itemData);
      return newItem;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create shopping item');
    }
  }
);

export const updateShoppingItem = createAsyncThunk(
  'shopping/updateItem',
  async ({ itemId, updates }: { itemId: string; updates: ShoppingItemUpdate }, { rejectWithValue }) => {
    try {
      const updatedItem = await shoppingItemApi.updateItem(itemId, updates);
      return updatedItem;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update shopping item');
    }
  }
);

export const deleteShoppingItem = createAsyncThunk(
  'shopping/deleteItem',
  async (itemId: string, { rejectWithValue }) => {
    try {
      await shoppingItemApi.deleteItem(itemId);
      return itemId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete shopping item');
    }
  }
);

export const searchShoppingItems = createAsyncThunk(
  'shopping/searchItems',
  async (searchTerm: string, { rejectWithValue }) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const items = await shoppingItemApi.searchItems(userId, searchTerm);
      return items;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search items');
    }
  }
);

// Async thunks for categories
export const fetchCategories = createAsyncThunk(
  'shopping/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const categories = await categoryApi.getCategories();
      return categories;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

// Shopping slice
const shoppingSlice = createSlice({
  name: 'shopping',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentList: (state, action: PayloadAction<ShoppingList | null>) => {
      state.currentList = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearItems: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch shopping lists
    builder
      .addCase(fetchShoppingLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShoppingLists.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload;
        state.error = null;
      })
      .addCase(fetchShoppingLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create shopping list
    builder
      .addCase(createShoppingList.fulfilled, (state, action) => {
        state.lists.push(action.payload);
      });

    // Update shopping list
    builder
      .addCase(updateShoppingList.fulfilled, (state, action) => {
        const index = state.lists.findIndex(list => list.id === action.payload.id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        }
        if (state.currentList?.id === action.payload.id) {
          state.currentList = action.payload;
        }
      });

    // Delete shopping list
    builder
      .addCase(deleteShoppingList.fulfilled, (state, action) => {
        state.lists = state.lists.filter(list => list.id !== action.payload);
        if (state.currentList?.id === action.payload) {
          state.currentList = null;
        }
        // Remove items from deleted list
        state.items = state.items.filter(item => item.listId !== action.payload);
      });

    // Share shopping list
    builder
      .addCase(shareShoppingList.fulfilled, (state, action) => {
        const index = state.lists.findIndex(list => list.id === action.payload.id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        }
        if (state.currentList?.id === action.payload.id) {
          state.currentList = action.payload;
        }
      });

    // Fetch shopping items
    builder
      .addCase(fetchShoppingItems.fulfilled, (state, action) => {
        // Replace items for this list
        state.items = state.items.filter(item => item.listId !== action.payload.listId);
        state.items.push(...action.payload.items);
      });

    // Create shopping item
    builder
      .addCase(createShoppingItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });

    // Update shopping item
    builder
      .addCase(updateShoppingItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });

    // Delete shopping item
    builder
      .addCase(deleteShoppingItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });

    // Search shopping items
    builder
      .addCase(searchShoppingItems.fulfilled, (state, action) => {
        // For search results, we might want to handle this differently
        // For now, we'll just update the items array
        state.items = action.payload;
      });

    // Fetch categories
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });

    // Handle all rejected cases
    builder
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  },
});

export const { clearError, setCurrentList, setLoading, clearItems } = shoppingSlice.actions;
export default shoppingSlice.reducer;
