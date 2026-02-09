"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "../translations/translations";
import wilayasData from "../data/wilayas.json";
import communesData from "../data/communes.json";

const OrderForm = ({ formData, errors, onChange, language }) => {
  const t = useTranslation(language);
  const [filteredCommunes, setFilteredCommunes] = useState([]);

  useEffect(() => {
    if (formData.wilaya) {
      const wilaya = wilayasData.find(
        (w) => w.id === parseInt(formData.wilaya),
      );
      if (wilaya) {
        const communes = communesData.filter((c) => c.wilaya_id === wilaya.id);
        setFilteredCommunes(communes);
      }
    } else {
      setFilteredCommunes([]);
      if (formData.commune) {
        onChange({ ...formData, commune: "" });
      }
    }
  }, [formData.wilaya]);

  const handleWilayaChange = (e) => {
    const wilayaId = e.target.value;
    onChange({
      ...formData,
      wilaya: wilayaId,
      commune: "", // Reset commune when wilaya changes
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">
        {t.deliveryInfo}
      </h2>

      {/* Nom et Prénom */}
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {t.fullName} *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={(e) => onChange({ ...formData, fullName: e.target.value })}
          className={`input-field ${errors.fullName ? "error" : ""}`}
          placeholder={t.fullNamePlaceholder}
        />
        {errors.fullName && <p className="error-message">{errors.fullName}</p>}
      </div>

      {/* Numéro de téléphone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {t.phone} *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={(e) => onChange({ ...formData, phone: e.target.value })}
          className={`input-field ${errors.phone ? "error" : ""}`}
          placeholder={t.phonePlaceholder}
        />
        {errors.phone && <p className="error-message">{errors.phone}</p>}
      </div>

      {/* Adresse */}
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {t.address} *
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={(e) => onChange({ ...formData, address: e.target.value })}
          className={`input-field ${errors.address ? "error" : ""}`}
          rows="3"
          placeholder={t.addressPlaceholder}
        />
        {errors.address && <p className="error-message">{errors.address}</p>}
      </div>

      {/* Wilaya */}
      <div>
        <label
          htmlFor="wilaya"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {t.wilaya} *
        </label>
        <select
          id="wilaya"
          name="wilaya"
          value={formData.wilaya}
          onChange={handleWilayaChange}
          className={`input-field ${errors.wilaya ? "error" : ""}`}
        >
          <option value="">{t.selectWilaya}</option>
          {wilayasData.map((wilaya) => (
            <option key={wilaya.id} value={wilaya.id}>
              {wilaya.code} - {wilaya.designation}
            </option>
          ))}
        </select>
        {errors.wilaya && <p className="error-message">{errors.wilaya}</p>}
      </div>

      {/* Commune */}
      <div>
        <label
          htmlFor="commune"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {t.commune} *
        </label>
        <select
          id="commune"
          name="commune"
          value={formData.commune}
          onChange={(e) => onChange({ ...formData, commune: e.target.value })}
          className={`input-field ${errors.commune ? "error" : ""}`}
          disabled={!formData.wilaya}
        >
          <option value="">
            {formData.wilaya ? t.selectCommune : t.selectWilayaFirst}
          </option>
          {filteredCommunes.map((commune) => (
            <option key={commune.id} value={commune.id}>
              {commune.designation}
            </option>
          ))}
        </select>
        {errors.commune && <p className="error-message">{errors.commune}</p>}
      </div>

      {/* Type de livraison */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {t.deliveryMode} *
        </label>
        <div className="space-y-3">
          <label className="flex items-center p-3 md:p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
            <input
              type="radio"
              name="deliveryType"
              value="bureau"
              checked={formData.deliveryType === "bureau"}
              onChange={(e) =>
                onChange({ ...formData, deliveryType: e.target.value })
              }
              className="w-4 h-4 md:w-5 md:h-5 text-blue-600"
            />
            <div className={language === "ar" ? "mr-3" : "ml-3"}>
              <span className="font-medium text-gray-800 text-sm md:text-base">
                {t.officeDelivery}
              </span>
              <p className="text-xs md:text-sm text-gray-600">
                {t.officeDeliveryDesc}
              </p>
            </div>
          </label>

          <label className="flex items-center p-3 md:p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
            <input
              type="radio"
              name="deliveryType"
              value="domicile"
              checked={formData.deliveryType === "domicile"}
              onChange={(e) =>
                onChange({ ...formData, deliveryType: e.target.value })
              }
              className="w-4 h-4 md:w-5 md:h-5 text-blue-600"
            />
            <div className={language === "ar" ? "mr-3" : "ml-3"}>
              <span className="font-medium text-gray-800 text-sm md:text-base">
                {t.homeDelivery}
              </span>
              <p className="text-xs md:text-sm text-gray-600">
                {t.homeDeliveryDesc}
              </p>
            </div>
          </label>
        </div>
        {errors.deliveryType && (
          <p className="error-message">{errors.deliveryType}</p>
        )}
      </div>
    </div>
  );
};

export default OrderForm;
