"use client";

import { useTranslation } from "../translations/translations";

const ColorSelector = ({ selectedColor, onColorSelect, language }) => {
  const t = useTranslation(language);

  const colors = [
    { name: "noir", hex: "#000000" },
    { name: "bleu", hex: "#1e3a8a" },
    { name: "vert", hex: "#065f46" },
    { name: "gris", hex: "#6b7280" },
    { name: "beige", hex: "#d4b896" },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        {t.color} *
      </label>
      <div className="flex gap-3 flex-wrap">
        {colors.map((color) => (
          <div key={color.name} className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => onColorSelect(color.name)}
              className={`color-option ${selectedColor === color.name ? "selected" : ""}`}
              style={{ backgroundColor: color.hex }}
              aria-label={t[color.name]}
              title={t[color.name]}
            />
            <span className="text-xs text-gray-600">{t[color.name]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
