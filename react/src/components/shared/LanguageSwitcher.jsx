import { useEffect, useState } from "react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
];

export default function LanguageSwitcher() {
  const [lang, setLang] = useState("en");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("googtrans="));
    if (cookie) {
      const selectedLang = cookie.split("/")[2];
      setLang(selectedLang);
    }
  }, []);

  const setLanguage = (dst) => {
    const expires = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toUTCString();
    document.cookie = `googtrans=/en/${dst}; path=/; expires=${expires}; SameSite=Lax`;
    window.location.reload();
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none"
      >
        <img src={`/flags/${lang}.svg`} alt={lang} className="w-5 h-5" />
        <span className="uppercase">{lang}</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="absolute mt-2 right-0 w-28 bg-white border border-gray-200 rounded shadow z-50">
          {LANGUAGES.map(({ code, label }) => (
            <li key={code}>
              <button
                onClick={() => setLanguage(code)}
                className={`w-full flex items-center justify-between text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  lang === code ? "font-bold text-gray-600" : ""
                }`}
              >
                <span>{label}</span>
                <img
                  src={`/flags/${lang}.svg`}
                  alt={lang}
                  className="w-5 h-5"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
