"use client";

import { useTranslation } from "../translations/translations";
import wilayasData from "../data/wilayas.json";
import communesData from "../data/communes.json";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  orderData,
  language,
}) => {
  const t = useTranslation(language);

  if (!isOpen) return null;

  const { orderItems, formData, totalPrice } = orderData;

  const wilaya = wilayasData.find((w) => w.id === parseInt(formData.wilaya));
  const commune = communesData.find((c) => c.id === parseInt(formData.commune));

  const getTotalItems = () => {
    return orderItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getProductsTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.quantity * 2500, 0);
  };

  const getDeliveryPrice = () => {
    if (!wilaya) return 0;
    return formData.deliveryType === "domicile"
      ? wilaya.prix_domicile
      : wilaya.prix_bureau;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content slide-in max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            {t.orderConfirmation}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={language === "ar" ? "إغلاق" : "Fermer"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-6 md:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4 md:space-y-6">
          {/* Articles commandés */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">
              {t.orderedItems}
            </h3>
            <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-2">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-xs md:text-sm"
                >
                  <span className="text-gray-700">
                    {item.quantity}x {language === "ar" ? "هودي" : "Hoodie"}{" "}
                    {t[item.color]} - {item.size}
                  </span>
                  <span className="font-medium">{item.quantity * 2500} DA</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200 flex justify-between font-semibold text-sm md:text-base">
                <span>
                  {t.subtotal} ({getTotalItems()}{" "}
                  {getTotalItems() > 1 ? t.items : t.item})
                </span>
                <span>{getProductsTotal()} DA</span>
              </div>
            </div>
          </div>

          {/* Informations de livraison */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">
              {t.deliveryInfo}
            </h3>
            <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-2 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t.fullName.replace(" *", "")}:
                </span>
                <span className="font-medium text-gray-800 text-right max-w-[60%]">
                  {formData.fullName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t.phone.replace(" *", "")}:
                </span>
                <span className="font-medium text-gray-800">
                  {formData.phone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t.address.replace(" *", "")}:
                </span>
                <span className="font-medium text-gray-800 text-right max-w-[60%]">
                  {formData.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t.wilaya.replace(" *", "")}:
                </span>
                <span className="font-medium text-gray-800">
                  {wilaya?.designation}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t.commune.replace(" *", "")}:
                </span>
                <span className="font-medium text-gray-800">
                  {commune?.designation}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t.deliveryMode.replace(" *", "")}:
                </span>
                <span className="font-medium text-gray-800">
                  {formData.deliveryType === "domicile"
                    ? t.homeDelivery
                    : t.officeDelivery}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between font-semibold">
                <span>{t.deliveryFees}</span>
                <span>{getDeliveryPrice()} DA</span>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 md:p-4">
            <div className="flex justify-between items-center">
              <span className="text-base md:text-lg font-bold text-gray-800">
                {t.totalToPay}
              </span>
              <span className="text-xl md:text-2xl font-bold text-blue-600">
                {totalPrice} DA
              </span>
            </div>
          </div>

          {/* Message de confirmation */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4">
            <p className="text-center text-gray-700 font-medium text-sm md:text-base">
              {t.confirmMessage}
            </p>
          </div>

          {/* Boutons */}
          <div className="flex gap-2 md:gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 md:px-6 py-2 md:py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
            >
              {t.cancel}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 btn-primary text-sm md:text-base"
            >
              {t.confirm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
