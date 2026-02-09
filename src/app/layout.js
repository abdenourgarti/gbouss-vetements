import "./globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";

export const metadata = {
  title: "G-Bouss Vêtements - Hoodie Premium",
  description: "Commandez votre hoodie premium pour homme - G-Bouss Vêtements",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
