import type { Metadata } from "next";
import { Anton, Archivo, Instrument_Serif } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PricingProvider } from "@/components/PricingContext";
import { CartProvider } from "@/components/CartContext";
import AuthSessionProvider from "@/components/SessionProvider";
import { REGION_COOKIE, isRegion, type Region } from "@/lib/geo";

const displayFont = Anton({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"],
});

const bodyFont = Archivo({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

const accentFont = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-accent",
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Fitness Studio — Strong Is Your Superpower",
  description:
    "Training programs in self-defense, yoga and wellness for women, led by Ayeesha Muzammil — Pakistan's first certified Para-Taekwondo instructor. Plus herbal wellness products.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(REGION_COOKIE)?.value;
  const initialRegion: Region = isRegion(raw) ? raw : "PK";

  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${accentFont.variable}`}>
      <body>
        <AuthSessionProvider>
          <PricingProvider initialRegion={initialRegion}>
            <CartProvider>
              <Header />
              <main className="min-h-[60vh]">{children}</main>
              <Footer />
            </CartProvider>
          </PricingProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
