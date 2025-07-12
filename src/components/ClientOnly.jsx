"use client";

import { useState, useEffect } from 'react';

export default function ClientOnly({ children }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    console.log('ClientOnly: useEffect triggered, setting mounted to true');
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    console.log('ClientOnly: Not mounted yet, returning null');
    return null;
  }

  console.log('ClientOnly: Mounted, rendering children');
  return children;
}
