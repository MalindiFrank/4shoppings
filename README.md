# 4Shopping List App

A comprehensive shopping list application built with React, TypeScript, Redux, and JSON Server. This application provides a complete solution for managing shopping lists with user authentication, real-time data persistence, and responsive design.

## Features

### User Management & Authentication
- **User Registration**: Create new accounts with email, password, name, and phone number
- **Secure Login**: Password encryption and validation
- **Profile Management**: Update personal information and change passwords
- **Protected Routes**: Authenticated access to main features

### Shopping List Management (CRUD Operations)
- **Create Lists**: Add new shopping lists with names and descriptions
- **View Lists**: Display all user's shopping lists in an organized grid
- **Edit Lists**: Modify list details and share with others
- **Delete Lists**: Remove lists with confirmation dialogs

### Shopping Item Management
- **Add Items**: Create items with name, quantity, category, notes, and images
- **Edit Items**: Modify item details including completion status
- **Delete Items**: Remove items with confirmation
- **Mark Complete**: Check off completed items

### Search & Filtering
- **Real-time Search**: Search items and lists by name
- **URL Parameters**: Search terms reflected in URL for bookmarking
- **Advanced Sorting**: Sort by name (A-Z, Z-A), category, or date
- **Category Filtering**: Filter items by predefined categories

### Categories & Organization
- **Predefined Categories**: Dairy, Produce, Meat, Bakery, Pantry, Frozen, Beverages, Snacks, Household, Personal Care
- **Color-coded Categories**: Visual organization with category colors
- **Category-based Sorting**: Group items by category

### Data Sharing
- **Share Lists**: Share shopping lists via email or shareable links
- **Collaborative Shopping**: Multiple users can access shared lists
- **Share Management**: View and manage who has access to lists

### Responsive Design
- **Mobile-first**: Optimized for mobile devices (320px+)
- **Tablet Support**: Enhanced experience on tablets (768px+)
- **Desktop Ready**: Full-featured desktop interface (1024px+)
- **Cross-browser Compatible**: Works on all modern browsers

## 🛠 Technology Stack

### Frontend
- **React 19+** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management with modern Redux patterns
- **React Router DOM v6** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Hook Form** - Form handling and validation

### Backend
- **JSON Server** - RESTful API simulation
- **bcryptjs** - Password hashing and encryption

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality
- **TypeScript ESLint** - TypeScript-specific linting

### Styling
- **CSS3** - Modern CSS with custom properties
- **Responsive Design** - Mobile-first approach
- **CSS Grid & Flexbox** - Modern layout techniques

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16.0 or higher)
- **npm** (version 7.0 or higher)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd shopping-list-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the JSON Server (Backend)

In one terminal window:

```bash
npm run server
```

This will start the JSON Server on `http://localhost:3001` with the following endpoints:
- `http://localhost:3001/users`
- `http://localhost:3001/shoppingLists`
- `http://localhost:3001/shoppingItems`
- `http://localhost:3001/categories`

### 4. Start the Development Server (Frontend)

In another terminal window:

```bash
npm run dev
```

This will start the Vite development server on `http://localhost:5173`

### 5. Access the Application

Open your browser and navigate to `http://localhost:5173`

## Demo Account

For testing purposes, you can use the following demo account:

- **Email**: demo@example.com
- **Password**: demo123

## Project Structure

```
shopping-list-app/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   │   ├── auth/          # Authentication components
│   │   ├── common/        # Common UI components
│   │   ├── layout/        # Layout components
│   │   └── shopping/      # Shopping-specific components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── store/             # Redux store and slices
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── db.json                # JSON Server database
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## Key Features Implementation

### Authentication & Security
- **Password Encryption**: Uses bcryptjs for secure password hashing
- **Protected Routes**: Prevents unauthorized access to authenticated pages
- **Token-based Auth**: JWT-like token system for session management
- **Form Validation**: Comprehensive client-side validation

### State Management
- **Redux Toolkit**: Modern Redux with simplified boilerplate
- **Async Thunks**: Handle API calls with loading and error states
- **Type Safety**: Full TypeScript integration with Redux
- **Persistent State**: Authentication state persists across sessions

### User Experience
- **Responsive Design**: Works seamlessly across all device sizes
- **Loading States**: Visual feedback during API operations
- **Error Handling**: User-friendly error messages and recovery
- **Intuitive Navigation**: Clear breadcrumbs and navigation patterns

### Data Management
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Real-time Updates**: Immediate UI updates after data changes
- **Search & Filter**: Advanced search with URL parameter integration
- **Data Validation**: Both client and server-side validation

## Responsive Breakpoints

The application is optimized for the following screen sizes:

- **320px** - Mobile portrait (minimum supported width)
- **480px** - Mobile landscape
- **768px** - Tablet portrait
- **1024px** - Desktop/laptop
- **1200px** - Large desktop

## Testing

The application has been tested across:

- **Browsers**: Chrome, Firefox, Safari, Edge
- **Devices**: Mobile phones, tablets, desktops
- **Screen Sizes**: 320px to 1200px+ widths
- **Functionality**: All CRUD operations, authentication, routing

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start JSON Server backend
- `npm run dev:full` - Start both frontend and backend concurrently
- `npm run lint` - Run ESLint

## Configuration

### Environment Variables

No environment variables are required for basic functionality. The application uses:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

### Customization

You can customize the application by:

1. **Adding Categories**: Edit `db.json` to add new item categories
2. **Styling**: Modify CSS custom properties in `src/index.css`
3. **API Endpoints**: Update base URL in `src/utils/api.ts`
4. **Validation Rules**: Modify validation functions in `src/utils/auth.ts`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
