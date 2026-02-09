"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../translations/translations";

const FORMSPREE_CONTACT_ENDPOINT = "https://formspree.io/f/mqedaqdj";

const Footer = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("sending");

    try {
      const response = await fetch(FORMSPREE_CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          _subject: `📧 Nouveau message de contact - ${formData.name}`,
          _replyto: formData.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message");
      }

      // Succès - vider tous les champs immédiatement
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });

      // Masquer le message de succès après 4 secondes
      setTimeout(() => setSubmitStatus(""), 4000);
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setSubmitStatus("error");

      // Masquer le message d'erreur après 4 secondes
      setTimeout(() => setSubmitStatus(""), 4000);
    }
  };

  return (
    <footer className="bg-gray-900 text-white mt-12 md:mt-20 w-full">
      <div className="container-custom py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Logo et About */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.jpg"
                alt="G-Bouss Vêtements"
                width={50}
                height={50}
                className="rounded-full md:w-[60px] md:h-[60px]"
              />
              <h3 className="text-lg md:text-xl font-bold">{t.siteName}</h3>
            </div>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
              {t.footerAbout}
            </p>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">
                {t.followUs}
              </h4>
              <div className="flex gap-3 md:gap-4">
                <a
                  href="https://www.tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 md:w-10 md:h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                  aria-label="TikTok"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>

                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 md:w-10 md:h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 md:w-10 md:h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 md:space-y-4">
            <h4 className="font-bold text-base md:text-lg">{t.quickLinks}</h4>
            <ul className="space-y-1.5 md:space-y-2 text-gray-300 text-sm md:text-base">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.home}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {language === "ar" ? "من نحن" : "À propos"}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {language === "ar" ? "المنتجات" : "Produits"}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.contactUs}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="space-y-3 md:space-y-4">
            <h4 className="font-bold text-base md:text-lg">{t.contactUs}</h4>
            <form onSubmit={handleSubmit} className="space-y-2 md:space-y-3">
              <input
                type="text"
                placeholder={t.namePlaceholder}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 md:px-4 py-1.5 md:py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm md:text-base"
                required
              />
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 md:px-4 py-1.5 md:py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm md:text-base"
                required
              />
              <input
                type="tel"
                placeholder={t.phonePlaceholder}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 md:px-4 py-1.5 md:py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm md:text-base"
              />
              <textarea
                placeholder={t.messagePlaceholder}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows="3"
                className="w-full px-3 md:px-4 py-1.5 md:py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none text-sm md:text-base"
                required
              />
              <button
                type="submit"
                disabled={submitStatus === "sending"}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 md:py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600 text-sm md:text-base"
              >
                {submitStatus === "sending" ? t.sending : t.send}
              </button>

              {/* Messages de statut */}
              {submitStatus === "success" && (
                <p className="text-green-400 text-xs md:text-sm text-center font-semibold">
                  ✓{" "}
                  {language === "ar"
                    ? "تم إرسال رسالتك بنجاح!"
                    : "Message envoyé avec succès !"}
                </p>
              )}

              {submitStatus === "error" && (
                <p className="text-red-400 text-xs md:text-sm text-center font-semibold">
                  ✗{" "}
                  {language === "ar"
                    ? "حدث خطأ. حاول مرة أخرى."
                    : "Erreur d'envoi. Réessayez."}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-4 md:pt-6 text-center text-gray-400 text-xs md:text-sm">
          <p>
            © {new Date().getFullYear()} {t.siteName} - {t.allRightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
