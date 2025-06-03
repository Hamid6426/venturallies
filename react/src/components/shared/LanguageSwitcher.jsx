import { useEffect, useState } from 'react';

export default function LanguageSwitcher() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('googtrans='));
    if (cookie) {
      const selectedLang = cookie.split('/')[2];
      setLang(selectedLang);
    }
  }, []);

  const setLanguage = (dst) => {
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `googtrans=/en/${dst}; path=/; expires=${expires}; SameSite=Lax`;
    window.location.reload();
  };

  return (
    <div className="relative">
      <button className="flex items-center space-x-2 text-sm">
        <img src={`/assets/images/${lang}.svg`} alt={lang} className="w-5" />
        <span>{lang.toUpperCase()}</span>
      </button>
      <div className="absolute bg-white shadow rounded mt-2 p-2 hidden group-hover:block">
        {['en', 'de', 'es', 'fr'].map(l => (
          <button key={l} onClick={() => setLanguage(l)} className={`block px-4 py-1 hover:bg-gray-100 ${lang === l && 'font-bold underline'}`}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
