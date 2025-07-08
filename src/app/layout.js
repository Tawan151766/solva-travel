import { Plus_Jakarta_Sans, Noto_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { AppProvider } from "@/core/context/AppProvider";
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/schema";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Wanderlust - Travel Packages",
    template: "%s | Wanderlust",
  },
  description:
    "Discover amazing travel packages and explore the world with Wanderlust. Find your perfect destination and create unforgettable memories.",
  keywords: [
    "travel",
    "packages",
    "vacation",
    "tourism",
    "adventure",
    "destinations",
    "wanderlust",
  ],
  authors: [{ name: "Wanderlust Team" }],
  creator: "Wanderlust",
  publisher: "Wanderlust",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://wanderlust-travel.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Wanderlust - Travel Packages",
    description:
      "Discover amazing travel packages and explore the world with Wanderlust",
    url: "https://wanderlust-travel.com",
    siteName: "Wanderlust",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Wanderlust Travel Packages",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wanderlust - Travel Packages",
    description:
      "Discover amazing travel packages and explore the world with Wanderlust",
    images: ["/twitter-image.jpg"],
    creator: "@wanderlust",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en" className="h-full">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="theme-color" content="#231f10" />
        <meta name="color-scheme" content="dark light" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${notoSans.variable} antialiased font-plus-jakarta-sans h-full`}
      >
        <AppProvider>
          <div className="min-h-full flex flex-col">
            <Navbar />
            <main className="flex-1">
              <div className="w-full">{children}</div>
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
