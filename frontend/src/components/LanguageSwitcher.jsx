import { useEffect, useState } from "react";

import en from "@/assets/flags/en.png";
import de from "@/assets/flags/de.png";
import es from "@/assets/flags/es.png";
import fr from "@/assets/flags/fr.png";

// ----- Constants -----
const flagMap = { en, de, es, fr };

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
];

// ----- Helpers -----
const getLanguageFromCookie = () => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("googtrans="));
  return cookie ? cookie.split("/")[2] : "en";
};

const setLanguageCookie = (lang) => {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `googtrans=/en/${lang}; path=/; expires=${expires}; SameSite=Lax`;
  window.location.reload();
};

// ----- Subcomponents -----
const LanguageButton = ({ lang, open, toggle }) => (
  <button
    onClick={toggle}
    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none"
  >
    <img
      src={flagMap[lang] || flagMap.en}
      alt={`${lang} flag`}
      className="w-6 h-4 object-cover"
    />
    <svg
      className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M19 9l-7 7-7-7" />
    </svg>
  </button>
);

const LanguageDropdown = ({ selectedLang, onSelect }) => (
  <ul className="absolute mt-2 right-0 w-28 bg-white border border-gray-200 rounded shadow z-50">
    {LANGUAGES.map(({ code, label }) => (
      <li key={code}>
        <button
          onClick={() => onSelect(code)}
          className={`w-full flex items-center justify-between text-left px-4 py-2 text-sm hover:bg-gray-100 ${
            selectedLang === code ? "font-bold text-gray-600" : ""
          }`}
        >
          <span className="text-xs">{label}</span>
          <img
            src={flagMap[code] || flagMap.en}
            alt={`${code} flag`}
            className="w-6 h-4 object-cover"
          />
        </button>
      </li>
    ))}
  </ul>
);

// ----- Main Component -----
export default function LanguageSwitcher() {
  const [lang, setLang] = useState("en");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedLang = getLanguageFromCookie();
    setLang(savedLang);
    localStorage.setItem("lang", savedLang);
  }, []);

  const handleSelectLanguage = (code) => {
    setLanguageCookie(code);
  };

  return (
    <div className="relative inline-block text-left">
      <LanguageButton
        lang={lang}
        open={open}
        toggle={() => setOpen((prev) => !prev)}
      />
      {open && (
        <LanguageDropdown selectedLang={lang} onSelect={handleSelectLanguage} />
      )}
    </div>
  );
}
