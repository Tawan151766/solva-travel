"use client";

import { 
  AboutUsHero, 
  AboutUsServices, 
  AboutUsStory
} from './index';

export function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black font-['Plus_Jakarta_Sans','Noto_Sans',sans-serif]">
      <AboutUsHero />
      <AboutUsServices />
      <AboutUsStory />
    </div>
  );
}
