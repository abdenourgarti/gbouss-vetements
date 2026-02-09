"use client";

import { useTranslation } from "../translations/translations";

const OrderList = ({ orderItems, onOrderItemsChange }) => {
  const [quantity, setQuantity] = useState(1);

  const addItem = (color, size) => {
    if (!color || !size) return;

    const newItem = {
      id: Date.now(),
      color,
      size,
      quantity,
    };

    onOrderItemsChange([...orderItems, newItem]);
    setQuantity(1);
  };

  const removeItem = (id) => {
    onOrderItemsChange(orderItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    onOrderItemsChange(
      orderItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const getTotalItems = () => {
    return orderItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    quantity,
    setQuantity,
    addItem,
    removeItem,
    updateQuantity,
    getTotalItems,
  };
};

const OrderListDisplay = ({
  orderItems,
  onRemove,
  onUpdateQuantity,
  language,
}) => {
  const t = useTranslation(language);

  const getTotalItems = () => {
    return orderItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (orderItems.length === 0) {
    return (
      <div className="text-center py-6 md:py-8 text-gray-500">
        <p className="text-sm md:text-base">{t.noItems}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base md:text-lg font-semibold">{t.yourOrder}</h3>
        <span className="bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
          {getTotalItems()} {getTotalItems() > 1 ? t.items : t.item}
        </span>
      </div>

      <div className="space-y-2">
        {orderItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-gray-50 p-2 md:p-3 rounded-lg border border-gray-200"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm md:text-base truncate">
                {language === "ar" ? "هودي" : "Hoodie"} {t[item.color]} -{" "}
                {language === "ar" ? "مقاس" : "Taille"} {item.size}
              </p>
              <p className="text-xs md:text-sm text-gray-600">
                {item.quantity} × 2000 DA = {item.quantity * 2000} DA
              </p>
            </div>

            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="px-2 md:px-3 py-1 hover:bg-gray-100 transition-colors text-sm md:text-base"
                >
                  -
                </button>
                <span className="px-2 md:px-3 py-1 border-x border-gray-300 min-w-[2rem] md:min-w-[3rem] text-center text-sm md:text-base">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="px-2 md:px-3 py-1 hover:bg-gray-100 transition-colors text-sm md:text-base"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label={language === "ar" ? "حذف" : "Supprimer"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-5 md:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { OrderList, OrderListDisplay };
