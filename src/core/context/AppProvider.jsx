"use client";

import { TravelProvider } from './TravelContext';
import { StaffProvider } from './StaffContext';
import { GalleryProvider } from './GalleryContext';

/**
 * Main App Provider that wraps all context providers
 * This makes it easy to add all providers to the app and manage global state
 */
export function AppProvider({ children }) {
  return (
    <TravelProvider>
      <StaffProvider>
        <GalleryProvider>
          {children}
        </GalleryProvider>
      </StaffProvider>
    </TravelProvider>
  );
}

export default AppProvider;
