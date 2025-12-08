# Overview

This is a full-stack e-commerce application for "Liminara" - a premium pharmaceutical-grade beauty and cosmetics platform. The application features a React frontend with a modern UI built using shadcn/ui components with an elegant skin-tone + white luxury aesthetic, and an Express.js backend with MySQL database integration. The application includes core e-commerce functionality like product catalog, shopping cart, wishlist, user authentication, and order management for premium skincare products.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Design System**: Liminara theme with modern skin-tone palette (nude, beige, cream, brown) for premium pharmaceutical-grade skincare aesthetic
- **Component Structure**: Modular components with separation between UI components, pages, and business logic

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: MySQL (configured for external database server)
- **Session Management**: Express sessions with PostgreSQL session storage
- **API Design**: RESTful API endpoints with proper error handling and validation
- **Payment Integration**: Razorpay for online payments
- **Development Setup**: Hot reload with Vite integration for full-stack development

## Database Schema
- **Users**: Authentication and profile management
- **Products**: Beauty and cosmetics catalog with categories, pricing, and inventory
- **Categories**: Product categorization system (serums, creams, cleansers, etc.)
- **Cart Items**: Shopping cart functionality with user sessions
- **Wishlist Items**: User wishlist management
- **Orders & Order Items**: Order processing and history
- **Product Reviews**: Customer reviews and ratings
- **Product Questions**: Customer questions and answers
- **Payments**: Payment transaction records with Razorpay integration
- **Contact Inquiries**: Customer support and inquiries
- **Sessions**: Server-side session storage

## Authentication & Authorization
- **Auth0 Integration**: Client-side Auth0 authentication with server session sync
- **User Management**: User registration, login, and profile management through Auth0
- **Protected Routes**: Client-side route protection based on authentication status
- **Session Storage**: Server-side session management for authenticated users

## Key Features
- **Product Catalog**: Browse beauty products with search, filtering, and categorization
- **Shopping Cart**: Add/remove items, quantity management, and checkout
- **Wishlist**: Save favorite products for later
- **Flash Deals**: Special ₹1 deals with countdown timers
- **Product Reviews**: Customer reviews and ratings system
- **Product Q&A**: Customer questions and answers
- **Responsive Design**: Mobile-first design with responsive navigation
- **Real-time Updates**: Optimistic updates and cache invalidation with React Query
- **Payment Integration**: Razorpay integration for secure online payments
- **COD Support**: Cash on Delivery payment option

# External Dependencies

## Core Technologies
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **drizzle-orm**: TypeScript ORM for database operations
- **drizzle-kit**: Database migration and schema management tools

## Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React router
- **@radix-ui/***: Accessible UI primitives for components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **date-fns**: Date manipulation utilities

## Backend Libraries
- **express**: Web application framework
- **connect-pg-simple**: PostgreSQL session store
- **zod**: Schema validation
- **drizzle-zod**: Integration between Drizzle and Zod for validation

## Development Tools
- **vite**: Build tool and development server
- **typescript**: Type safety across the application
- **@replit/vite-plugin-***: Replit-specific development tools
- **esbuild**: Fast JavaScript bundler for production builds

## UI Components
The application uses a comprehensive set of shadcn/ui components including forms, dialogs, navigation, data display, and feedback components, all built on top of Radix UI primitives for accessibility.

## Theming & Customization

### Liminara Theme
The application features a sophisticated skin-tone + white luxury aesthetic for premium pharmaceutical-grade skincare:
- **Color Palette**: Modern skin-tone palette with nude, beige, cream, and elegant brown accents
- **CSS Variables**: Complete variable system in `client/src/index.css`
- **Luxury Aesthetic**: Premium skincare brand positioning with clean, clinical elegance
- **Accessibility**: WCAG AA compliant color contrasts
- **Component Guidelines**: Elegant styling for product displays, hero sections, and navigation

The theme features:
- Warm cream/white backgrounds (#FFFAF5) for a clean, clinical feel
- Nude primary color (#F5D7B0) for soft elegance
- Beige secondary tones (#E3C7A0) for depth and warmth
- Brown accents (#4B3A2F, #3B2D25) for CTA buttons and actions
- Smooth gradients and transitions for premium feel
- Frosted glass effects and backdrop blur on cards and modals
- Playfair Display font for elegant headlines
- Inter font for clean, modern body text

Color Variables:
- Primary: #F5D7B0 (nude), #FFFFFF (white)
- Secondary: #E3C7A0 (beige), #4B3A2F (brown)
- Typography: #3B2D25 (headings), #4A4A4A (body)
- Backgrounds: #FFFAF5 (cream), #FFF4E8 (warm white)
- Accents: #5C4A3A (muted brown), #8B7355 (soft bronze)