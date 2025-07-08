"use client";

import { 
  AboutUsHero, 
  AboutUsServices, 
  AboutUsStory, 
  AboutUsContact 
} from './index';

export function AboutUs() {
  return (
    <div className="min-h-screen bg-[#231f10] font-['Plus_Jakarta_Sans','Noto_Sans',sans-serif]">
      <AboutUsHero />
      <AboutUsServices />
      <AboutUsStory />
      <AboutUsContact />
    </div>
  );
}
