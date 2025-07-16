# Solva Travel - UI/UX Patterns

## Design System
- **Primary Color**: Golden (#FFD700) for highlights, buttons, and accents
- **Background**: Dark theme with black/gray backgrounds
- **Text**: White primary text, golden secondary text
- **Borders**: Golden borders with opacity (border-[#FFD700]/30)

## Component Patterns

### Form Components
- Use controlled inputs with proper state management
- Apply consistent styling: `bg-black/50 border border-[#FFD700]/30 rounded-xl text-white`
- Implement focus states: `focus:outline-none focus:border-[#FFD700] focus:bg-black/70`
- Show validation errors with toast notifications
- Use Thai labels with English placeholders

### Button Patterns
```jsx
// Primary Button
className="bg-[#FFD700] text-black px-6 py-3 rounded-xl font-medium hover:bg-[#FFD700]/90 transition-all"

// Secondary Button  
className="bg-[#FFD700]/10 text-[#FFD700] px-6 py-3 rounded-xl border border-[#FFD700]/30 hover:bg-[#FFD700]/20 transition-all"

// Danger Button
className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg border border-red-500/30 hover:bg-red-500/20"
```

### Modal Patterns
- Use consistent modal styling with dark backgrounds
- Implement proper backdrop blur and overlay
- Include close buttons and escape key handling
- Use golden borders and accents
- Implement proper z-index layering

### Table Patterns
- Use alternating row colors for better readability
- Implement hover states for interactive rows
- Use golden headers with proper contrast
- Include loading states and empty states
- Implement responsive design for mobile

### Loading States
- Use consistent loading spinners or skeletons
- Show loading text in Thai/English
- Implement proper loading boundaries
- Use golden accent colors for loading indicators

## Layout Patterns

### Page Structure
```jsx
<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
  <Header />
  <main className="container mx-auto px-4 py-8">
    {/* Page content */}
  </main>
  <Footer />
</div>
```

### Card Components
```jsx
<div className="bg-black/50 border border-[#FFD700]/30 rounded-xl p-6 backdrop-blur-sm">
  {/* Card content */}
</div>
```

## Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Use grid layouts that adapt to screen size
- Implement proper touch targets for mobile
- Ensure text remains readable on all devices
- Test on various screen sizes

## Accessibility
- Use proper ARIA labels and roles
- Implement keyboard navigation
- Ensure sufficient color contrast
- Provide alternative text for images
- Use semantic HTML elements

## Animation & Transitions
- Use subtle transitions for better UX
- Implement hover effects on interactive elements
- Use consistent timing functions
- Avoid excessive animations that may cause motion sickness
- Use `transition-all` class for smooth transitions