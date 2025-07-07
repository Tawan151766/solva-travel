export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Wanderlust",
    "description": "Discover amazing travel packages and explore the world with Wanderlust",
    "url": "https://wanderlust-travel.com",
    "logo": "https://wanderlust-travel.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-0123",
      "contactType": "customer service",
      "availableLanguage": ["English", "Thai"]
    },
    "sameAs": [
      "https://facebook.com/wanderlust",
      "https://instagram.com/wanderlust",
      "https://twitter.com/wanderlust"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Travel Street",
      "addressLocality": "Bangkok",
      "addressCountry": "Thailand"
    },
    "offers": {
      "@type": "Offer",
      "category": "Travel Packages",
      "description": "Customized travel packages to amazing destinations worldwide"
    }
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Wanderlust - Travel Packages",
    "url": "https://wanderlust-travel.com",
    "description": "Discover amazing travel packages and explore the world with Wanderlust",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://wanderlust-travel.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
}
