"use client";

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function OurStaff() {
  useEffect(() => {
    redirect('/staff');
  }, []);

  return (
    <div className="min-h-screen bg-[#231f10] flex items-center justify-center">
      <div className="text-white text-center">
        <p className="text-lg">Redirecting to our staff page...</p>
      </div>
    </div>
  );
}
