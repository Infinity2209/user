# Frontend Assignment - React Admin Panel

A modern, responsive admin panel built with React, Redux Toolkit, and Tailwind CSS. This application provides a comprehensive dashboard for managing users and products with role-based authentication and internationalization support.

## 🚀 Features

### Core Functionality
- **Authentication System**: Login/logout with JWT token management and localStorage persistence
- **Role-Based Access Control**: Admin and user roles with protected routes
- **User Management**: Full CRUD operations for users (admin only)
- **Product Management**: Complete product catalog with search, filtering, and CRUD operations
- **Dashboard**: Overview with key metrics and quick actions

### Technical Features
- **Responsive Design**: Mobile-first approach with collapsible sidebar
- **Dark Mode Support**: Theme toggle with system preference detection
- **Internationalization**: English and Spanish language support
- **Real-time Updates**: Optimistic updates and cache invalidation with RTK Query
- **Form Validation**: Comprehensive input validation and error handling
- **Loading States**: Skeleton loaders and progress indicators

### UI/UX
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Interactive Components**: Modals, tables, cards, and form elements
- **Accessibility**: ARIA labels and keyboard navigation support
- **Toast Notifications**: Success/error feedback for user actions

## 🛠️ Tech Stack

### Frontend Framework
- **React 19**: Latest React with hooks and concurrent features
- **Vite**: Fast build tool and development server
- **React Router DOM**: Client-side routing with protected routes

### State Management
- **Redux Toolkit**: Simplified Redux with RTK Query for API state
- **RTK Query**: Powerful data fetching and caching solution

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, consistent icon library
- **Class Variance Authority**: Component variant management
- **Tailwind Merge**: Intelligent class merging

### Development Tools
- **ESLint**: Code linting and formatting
- **JSON Server**: Mock API for development
- **PostCSS**: CSS processing with Autoprefixer

### Additional Libraries
- **React i18next**: Internationalization framework
- **React Redux**: Official React bindings for Redux

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI primitives (Button, Input, etc.)
│   ├── layout/         # Layout components (Header, Sidebar, Footer)
│   ├── forms/          # Form-related components
│   └── common/         # Shared components
├── pages/              # Page components
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Users.jsx       # User management
│   ├── Products.jsx    # Product catalog
│   ├── Settings.jsx    # Settings page
│   ├── Login.jsx       # Authentication
│   └── NotFound.jsx    # 404 page
├── store/              # Redux store configuration
│   ├── index.js        # Store setup
│   ├── slices/         # Redux slices
│   │   └── authSlice.js # Authentication state
│   └── apis/           # RTK Query API slices
│       ├── usersApi.js
│       └── productsApi.js
├── i18n/               # Internationalization
├── utils/              # Utility functions
└── App.jsx             # Main app component
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the mock API server**
   ```bash
   npm run json-server
   ```
   This starts JSON Server on `http://localhost:3001`

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔐 Authentication

### Default Credentials
- **Admin User**: Any user with `role: "admin"` in `db.json`
- **Regular User**: Any user with `role: "user"` in `db.json`

### Login Process
1. Enter email and password
2. JWT token is stored in localStorage
3. User data and authentication state are managed by Redux

## 📊 API Endpoints

The application uses JSON Server for mock API endpoints:

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

## 🎨 Customization

### Themes
The app supports light and dark themes. Theme preference is stored in localStorage and respects system preferences.

### Languages
Currently supports English and Spanish. Language files are located in `src/i18n/`.

### Styling
- Colors and spacing can be customized in `tailwind.config.js`
- Component styles use Tailwind utility classes
- Custom CSS variables are defined in `src/index.css`

## 🧪 Development

### Code Quality
- ESLint configuration ensures code consistency
- Prettier formatting for clean code
- TypeScript-ready structure for future migration

### Performance
- Code splitting with Vite
- Lazy loading for route components
- Optimized bundle size with tree shaking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Redux Toolkit](https://redux-toolkit.js.org/) - The official, opinionated, batteries-included toolset for efficient Redux development
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [JSON Server](https://github.com/typicode/json-server) - Get a full fake REST API with zero coding
- [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit
