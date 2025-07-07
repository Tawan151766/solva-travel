export function Footer() {
  return (
    <footer className="bg-[#231f10] border-t border-[#4a4221] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-6">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Wanderlust</h3>
            </div>
            <p className="text-[#cdc08e] mb-4 max-w-md">
              Discover amazing travel packages and explore the world with Wanderlust. 
              Create unforgettable memories with our carefully curated destinations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#cdc08e] hover:text-[#efc004] transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" className="text-[#cdc08e] hover:text-[#efc004] transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297c-.875-.807-1.376-1.888-1.376-3.091c0-1.203.501-2.284 1.376-3.091c.875-.807 2.026-1.297 3.323-1.297c1.297 0 2.448.49 3.323 1.297c.875.807 1.376 1.888 1.376 3.091c0 1.203-.501 2.284-1.376 3.091c-.875.807-2.026 1.297-3.323 1.297z"/>
                </svg>
              </a>
              <a href="#" className="text-[#cdc08e] hover:text-[#efc004] transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#cdc08e] hover:text-[#efc004] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-[#cdc08e] hover:text-[#efc004] transition-colors">
                  Destinations
                </a>
              </li>
              <li>
                <a href="#" className="text-[#cdc08e] hover:text-[#efc004] transition-colors">
                  Travel Packages
                </a>
              </li>
              <li>
                <a href="#" className="text-[#cdc08e] hover:text-[#efc004] transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#cdc08e] hover:text-[#efc004] transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-[#cdc08e] hover:text-[#efc004] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-[#cdc08e] hover:text-[#efc004] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-[#cdc08e] hover:text-[#efc004] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#4a4221] flex flex-col sm:flex-row justify-between items-center">
          <p className="text-[#cdc08e] text-sm">
            © 2025 Wanderlust. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-[#cdc08e] hover:text-[#efc004] text-sm transition-colors">
              Privacy
            </a>
            <a href="#" className="text-[#cdc08e] hover:text-[#efc004] text-sm transition-colors">
              Terms
            </a>
            <a href="#" className="text-[#cdc08e] hover:text-[#efc004] text-sm transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
