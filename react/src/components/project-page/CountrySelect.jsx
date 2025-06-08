// CountrySelect.jsx
const countries = [
  { code: "all", label: "All Countries" },
  { code: "at", label: "Austria" },
  { code: "be", label: "Belgium" },
  { code: "bg", label: "Bulgaria" },
  { code: "hr", label: "Croatia" },
  { code: "cy", label: "Cyprus" },
  { code: "cz", label: "Czech Republic" },
  { code: "dk", label: "Denmark" },
  { code: "ee", label: "Estonia" },
  { code: "fi", label: "Finland" },
  { code: "fr", label: "France" },
  { code: "de", label: "Germany" },
  { code: "gr", label: "Greece" },
  { code: "hu", label: "Hungary" },
  { code: "ie", label: "Ireland" },
  { code: "it", label: "Italy" },
  { code: "lv", label: "Latvia" },
  { code: "lt", label: "Lithuania" },
  { code: "lu", label: "Luxembourg" },
  { code: "mt", label: "Malta" },
  { code: "nl", label: "Netherlands" },
  { code: "pl", label: "Poland" },
  { code: "pt", label: "Portugal" },
  { code: "ro", label: "Romania" },
  { code: "sk", label: "Slovakia" },
  { code: "si", label: "Slovenia" },
  { code: "es", label: "Spain" },
  { code: "se", label: "Sweden" },
];

export default function CountrySelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full border-2 border-gray-400 rounded p-4 mt-2"
    >
      {countries.map((c) => (
        <option key={c.code} value={c.code}>
          {c.label}
        </option>
      ))}
    </select>
  );
}
