# Solva Travel - Coding Standards

## React Component Standards
- Use functional components with hooks
- Implement proper error boundaries and loading states
- Use TypeScript-style JSDoc comments for complex functions
- Follow the existing component structure pattern

## Form Handling
- Use controlled components with proper state management
- Implement client-side validation before API calls
- Handle JSON data conversion properly (object ↔ string)
- Show user-friendly error messages in Thai and English
- Use the existing toast notification system

## API Route Standards
- Follow RESTful conventions
- Implement proper error handling with meaningful status codes
- Use JWT authentication for protected routes
- Validate input data using Prisma schema constraints
- Return consistent response formats: `{ success: boolean, data?: any, message?: string }`

## Database Operations
- Use Prisma Client for all database operations
- Implement proper transaction handling for complex operations
- Use proper error handling for database constraints
- Follow the existing schema relationships

## Styling Guidelines
- Use Tailwind CSS classes consistently
- Follow the golden theme color scheme (#FFD700)
- Use the existing component styling patterns
- Implement responsive design for all components
- Use the established dark theme with gold accents

## State Management
- Use React Context for global state (Auth, Travel, Gallery, Staff)
- Use custom hooks for complex state logic
- Implement proper loading and error states
- Use local state for component-specific data

## File Organization
- Follow the existing directory structure
- Group related components in subdirectories
- Use descriptive file names
- Keep API routes organized by feature