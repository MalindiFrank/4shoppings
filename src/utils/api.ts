import axios from 'axios';
import type {
  UserRegistration,
  UserLogin,
  UserProfile,
  UserUpdate,
  ShoppingList,
  ShoppingListCreate,
  ShoppingListUpdate,
  ShoppingItem,
  ShoppingItemCreate,
  ShoppingItemUpdate,
  Category,
} from '../types/index';

const API_BASE_URL = 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User API
export const userApi = {
  // Register new user
  register: async (userData: UserRegistration): Promise<UserProfile> => {
    const response = await api.post('/users', {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Login user
  login: async (credentials: UserLogin): Promise<{ user: UserProfile; token: string }> => {
    const response = await api.get(`/users?email=${credentials.email}`);
    const users = response.data;

    if (users.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = users[0];

    // For demo purposes, we'll accept the demo password or any password for now
    // In a real app, you'd verify the password hash here
    if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
      // Demo user login
    } else {
      // For other users, just accept any password for demo purposes
      // In production, you would verify the hashed password
    }

    const token = `token_${user.id}_${Date.now()}`;
    localStorage.setItem('authToken', token);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        cellPhone: user.cellPhone,
      },
      token,
    };
  },

  // Get user profile
  getProfile: async (userId: string): Promise<UserProfile> => {
    const response = await api.get(`/users/${userId}`);
    const user = response.data;
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      cellPhone: user.cellPhone,
    };
  },

  // Update user profile
  updateProfile: async (userId: string, updates: UserUpdate): Promise<UserProfile> => {
    const response = await api.patch(`/users/${userId}`, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },
};

// Shopping Lists API
export const shoppingListApi = {
  // Get all lists for a user
  getLists: async (userId: string): Promise<ShoppingList[]> => {
    const response = await api.get(`/shoppingLists?userId=${userId}`);
    return response.data;
  },

  // Get single list
  getList: async (listId: string): Promise<ShoppingList> => {
    const response = await api.get(`/shoppingLists/${listId}`);
    return response.data;
  },

  // Create new list
  createList: async (userId: string, listData: ShoppingListCreate): Promise<ShoppingList> => {
    const response = await api.post('/shoppingLists', {
      ...listData,
      id: Date.now().toString(),
      userId,
      sharedWith: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update list
  updateList: async (listId: string, updates: ShoppingListUpdate): Promise<ShoppingList> => {
    const response = await api.patch(`/shoppingLists/${listId}`, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete list
  deleteList: async (listId: string): Promise<void> => {
    await api.delete(`/shoppingLists/${listId}`);
    // Also delete all items in the list
    const itemsResponse = await api.get(`/shoppingItems?listId=${listId}`);
    const items = itemsResponse.data;
    await Promise.all(items.map((item: ShoppingItem) => api.delete(`/shoppingItems/${item.id}`)));
  },

  // Share list
  shareList: async (listId: string, userEmail: string): Promise<ShoppingList> => {
    const list = await shoppingListApi.getList(listId);
    const updatedSharedWith = [...list.sharedWith, userEmail];
    return shoppingListApi.updateList(listId, { sharedWith: updatedSharedWith });
  },
};

// Shopping Items API
export const shoppingItemApi = {
  // Get all items for a list
  getItems: async (listId: string): Promise<ShoppingItem[]> => {
    const response = await api.get(`/shoppingItems?listId=${listId}`);
    return response.data;
  },

  // Get single item
  getItem: async (itemId: string): Promise<ShoppingItem> => {
    const response = await api.get(`/shoppingItems/${itemId}`);
    return response.data;
  },

  // Create new item
  createItem: async (listId: string, itemData: ShoppingItemCreate): Promise<ShoppingItem> => {
    const response = await api.post('/shoppingItems', {
      ...itemData,
      id: Date.now().toString(),
      listId,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update item
  updateItem: async (itemId: string, updates: ShoppingItemUpdate): Promise<ShoppingItem> => {
    const response = await api.patch(`/shoppingItems/${itemId}`, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete item
  deleteItem: async (itemId: string): Promise<void> => {
    await api.delete(`/shoppingItems/${itemId}`);
  },

  // Search items
  searchItems: async (userId: string, searchTerm: string): Promise<ShoppingItem[]> => {
    // Get all user's lists first
    const lists = await shoppingListApi.getLists(userId);
    const listIds = lists.map(list => list.id);
    
    // Get all items for user's lists
    const allItemsPromises = listIds.map(listId => shoppingItemApi.getItems(listId));
    const allItemsArrays = await Promise.all(allItemsPromises);
    const allItems = allItemsArrays.flat();
    
    // Filter items by search term
    return allItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },
};

// Categories API
export const categoryApi = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },
};

export default api;
