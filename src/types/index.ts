// User types
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  cellPhone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRegistration {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  cellPhone: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  cellPhone: string;
}

export interface UserUpdate {
  firstName?: string;
  lastName?: string;
  cellPhone?: string;
  email?: string;
  password?: string;
}

// Shopping List types
export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  sharedWith: string[];
}

export interface ShoppingListCreate {
  name: string;
  description: string;
}

export interface ShoppingListUpdate {
  name?: string;
  description?: string;
  sharedWith?: string[];
}

// Shopping Item types
export interface ShoppingItem {
  id: string;
  listId: string;
  name: string;
  quantity: number;
  category: string;
  notes: string;
  imageUrl: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingItemCreate {
  name: string;
  quantity: number;
  category: string;
  notes?: string;
  imageUrl?: string;
}

export interface ShoppingItemUpdate {
  name?: string;
  quantity?: number;
  category?: string;
  notes?: string;
  imageUrl?: string;
  completed?: boolean;
}

// Category types
export interface Category {
  id: string;
  name: string;
  color: string;
}

// Auth types
export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Shopping types
export interface ShoppingState {
  lists: ShoppingList[];
  items: ShoppingItem[];
  categories: Category[];
  currentList: ShoppingList | null;
  loading: boolean;
  error: string | null;
}



// Search and Filter types
export interface SearchParams {
  search?: string;
  sort?: 'name-asc' | 'name-desc' | 'category' | 'date-asc' | 'date-desc';
  category?: string;
}

// Form types
export interface FormErrors {
  [key: string]: string;
}

// Route types
export interface ProtectedRouteProps {
  children: React.ReactNode;
}
