"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductGallery from "../components/ProductGallery";
import ColorSelector from "../components/ColorSelector";
import SizeSelector from "../components/SizeSelector";
import { OrderListDisplay } from "../components/OrderList";
import OrderForm from "../components/OrderForm";
import ConfirmationModal from "../components/ConfirmationModal";
import { sendOrderEmail } from "../utils/emailService";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../translations/translations";
import wilayasData from "../data/wilayas.json";
import communesData from "../data/communes.json";

export default function Home() {
  const { language } = useLanguage();
  const t = useTranslation(language);

  // États pour la sélection de produit
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);

  // États pour le formulaire
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    wilaya: "",
    commune: "",
    deliveryType: "bureau",
  });

  const [errors, setErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Calcul du prix total
  useEffect(() => {
    const productsTotal = orderItems.reduce(
      (sum, item) => sum + item.quantity * 2000,
      0,
    );
    let deliveryPrice = 0;

    if (formData.wilaya) {
      const wilaya = wilayasData.find(
        (w) => w.id === parseInt(formData.wilaya),
      );
      if (wilaya) {
        deliveryPrice =
          formData.deliveryType === "domicile"
            ? wilaya.prix_domicile
            : wilaya.prix_bureau;
      }
    }

    setTotalPrice(productsTotal + deliveryPrice);
  }, [orderItems, formData.wilaya, formData.deliveryType]);

  // Ajouter un article à la commande
  const addItemToOrder = () => {
    if (!selectedColor || !selectedSize) {
      alert(
        language === "ar"
          ? "الرجاء اختيار اللون والمقاس"
          : "Veuillez sélectionner une couleur et une taille",
      );
      return;
    }

    const newItem = {
      id: Date.now(),
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
    };

    setOrderItems([...orderItems, newItem]);
    setSelectedColor("");
    setSelectedSize("");
    setQuantity(1);
  };

  // Supprimer un article de la commande
  const removeItem = (id) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  // Mettre à jour la quantité d'un article
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }

    setOrderItems(
      orderItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t.required;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t.required;
    } else if (!/^0[5-7][0-9]{8}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = t.invalidPhone;
    }

    if (!formData.address.trim()) {
      newErrors.address = t.required;
    }

    if (!formData.wilaya) {
      newErrors.wilaya = t.required;
    }

    if (!formData.commune) {
      newErrors.commune = t.required;
    }

    if (!formData.deliveryType) {
      newErrors.deliveryType = t.required;
    }

    if (orderItems.length === 0) {
      alert(t.addAtLeastOne);
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gérer la soumission
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    setIsModalOpen(true);
  };

  // Confirmer la commande
  const confirmOrder = async () => {
    setIsSubmitting(true);

    try {
      const wilaya = wilayasData.find(
        (w) => w.id === parseInt(formData.wilaya),
      );
      const commune = communesData.find(
        (c) => c.id === parseInt(formData.commune),
      );

      const orderData = {
        orderItems,
        formData: {
          ...formData,
          wilayaName: wilaya?.designation,
          communeName: commune?.designation,
        },
        totalPrice,
      };

      // Envoi de l'email via Formspree
      await sendOrderEmail(orderData);

      // Fermer le modal
      setIsModalOpen(false);

      // Afficher le message de succès
      setSubmitSuccess(true);

      // Vider TOUS les champs immédiatement
      setOrderItems([]);
      setSelectedColor("");
      setSelectedSize("");
      setQuantity(1);
      setFormData({
        fullName: "",
        phone: "",
        address: "",
        wilaya: "",
        commune: "",
        deliveryType: "bureau",
      });
      setErrors({});

      // Faire défiler vers le haut de la page
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Masquer le message de succès après 4 secondes
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 4000);
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      alert(
        language === "ar"
          ? "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى."
          : "Une erreur est survenue lors de l'envoi de la commande. Veuillez réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    orderItems.length > 0 &&
    formData.fullName &&
    formData.phone &&
    formData.address &&
    formData.wilaya &&
    formData.commune;

  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />

      <main className="min-h-screen py-4 md:py-8 px-3 md:px-4 w-full">
        <div className="container-custom w-full">
          {/* En-tête */}
          <header className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 px-2">
              {t.siteName}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 px-2">
              {t.heroTitle}
            </p>
          </header>

          {/* Notification de succès */}
          {submitSuccess && (
            <div className="fixed top-20 md:top-24 left-4 right-4 md:right-4 md:left-auto bg-green-500 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg shadow-lg z-50 slide-in max-w-md mx-auto md:mx-0">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="font-semibold text-sm md:text-base">
                  {t.orderSuccess}
                </p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-4 md:gap-8 w-full">
            {/* Section gauche - Produit */}
            <div className="space-y-4 md:space-y-6 w-full">
              <div className="card">
                <ProductGallery selectedColor={selectedColor} />
              </div>

              <div className="card">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
                  {t.productTitle}
                </h2>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                  {t.productDescription}
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-base md:text-lg font-semibold text-gray-700">
                      {t.unitPrice}
                    </span>
                    <span className="text-2xl md:text-3xl font-bold text-blue-600">
                      2000 DA
                    </span>
                  </div>
                </div>

                <ColorSelector
                  selectedColor={selectedColor}
                  onColorSelect={setSelectedColor}
                  language={language}
                />

                <div className="mt-4 md:mt-6">
                  <SizeSelector
                    selectedSize={selectedSize}
                    onSizeSelect={setSelectedSize}
                    language={language}
                  />
                </div>

                <div className="mt-4 md:mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.quantity}
                  </label>
                  <div className="flex items-center gap-2 md:gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 md:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors text-sm md:text-base"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-16 md:w-20 text-center input-field text-sm md:text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 md:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors text-sm md:text-base"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addItemToOrder}
                  className="w-full mt-4 md:mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 md:py-3 rounded-lg transition-colors disabled:bg-gray-400 text-sm md:text-base"
                  disabled={!selectedColor || !selectedSize}
                >
                  {t.addToOrder}
                </button>
              </div>
            </div>

            {/* Section droite - Commande et Formulaire */}
            <div className="space-y-4 md:space-y-6 w-full">
              {/* Liste de commande */}
              <div className="card">
                <OrderListDisplay
                  orderItems={orderItems}
                  onRemove={removeItem}
                  onUpdateQuantity={updateQuantity}
                  language={language}
                />
              </div>

              {/* Formulaire */}
              <div className="card">
                <OrderForm
                  formData={formData}
                  errors={errors}
                  onChange={setFormData}
                  language={language}
                />
              </div>

              {/* Récapitulatif et bouton Commander */}
              <div className="card bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex justify-between items-center text-base md:text-lg">
                    <span className="font-semibold text-gray-700">
                      {t.itemsTotal}
                    </span>
                    <span className="font-bold">
                      {orderItems.reduce(
                        (sum, item) => sum + item.quantity * 2000,
                        0,
                      )}{" "}
                      DA
                    </span>
                  </div>

                  {formData.wilaya && (
                    <div className="flex justify-between items-center text-base md:text-lg">
                      <span className="font-semibold text-gray-700">
                        {t.deliveryFees}
                      </span>
                      <span className="font-bold">
                        {(() => {
                          const wilaya = wilayasData.find(
                            (w) => w.id === parseInt(formData.wilaya),
                          );
                          return wilaya
                            ? formData.deliveryType === "domicile"
                              ? wilaya.prix_domicile
                              : wilaya.prix_bureau
                            : 0;
                        })()}{" "}
                        DA
                      </span>
                    </div>
                  )}

                  <div className="pt-3 md:pt-4 border-t-2 border-indigo-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg md:text-xl font-bold text-gray-800">
                        {t.totalToPay}
                      </span>
                      <span className="text-2xl md:text-3xl font-bold text-indigo-600">
                        {totalPrice} DA
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit || isSubmitting}
                    className="w-full btn-primary text-base md:text-lg py-3 md:py-4"
                  >
                    {isSubmitting ? t.sending : t.order}
                  </button>

                  {!canSubmit && orderItems.length === 0 && (
                    <p className="text-xs md:text-sm text-center text-gray-600">
                      {t.addAtLeastOne}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal de confirmation */}
          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={confirmOrder}
            orderData={{ orderItems, formData, totalPrice }}
            language={language}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
