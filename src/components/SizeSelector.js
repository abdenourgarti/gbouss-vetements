"use client";

import { useTranslation } from "../translations/translations";

const SizeSelector = ({ selectedSize, onSizeSelect, language }) => {
  const t = useTranslation(language);
  const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        {t.size} *
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onSizeSelect(size)}
            className={`size-option ${selectedSize === size ? "selected" : ""}`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
