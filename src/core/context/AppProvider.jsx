"use client";

import { TravelProvider } from './TravelContext';
import { StaffProvider } from './StaffContext';
import { GalleryProvider } from './GalleryContext';
import { AuthProvider } from '@/contexts/AuthContext-simple';
import ClientOnly from '@/components/ClientOnly';

/**
 * Main App Provider that wraps all context providers
 * This makes it easy to add all providers to the app and manage global state
 */
export function AppProvider({ children }) {
  return (
    <ClientOnly>
      <AuthProvider>
        <TravelProvider>
          <StaffProvider>
            <GalleryProvider>
              {children}
            </GalleryProvider>
          </StaffProvider>
        </TravelProvider>
      </AuthProvider>
    </ClientOnly>
  );
}

export default AppProvider;
