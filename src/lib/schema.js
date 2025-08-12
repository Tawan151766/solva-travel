export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "BK18PLUS",
    "description": "Discover amazing travel packages and explore the world with BK18PLUS",
    "url": "https://BK18PLUS-travel.com",
    "logo": "https://BK18PLUS-travel.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-0123",
      "contactType": "customer service",
      "availableLanguage": ["English", "Thai"]
    },
    "sameAs": [
      "https://facebook.com/BK18PLUS",
      "https://instagram.com/BK18PLUS",
      "https://twitter.com/BK18PLUS"
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

// Test
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BK18PLUS Travel",
    "url": "https://BK18PLUS-travel.com",
    "description": "Discover amazing travel packages and explore the world with BK18PLUS",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://BK18PLUS-travel.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
}
