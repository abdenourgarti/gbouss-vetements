// utils/emailService.js
// Service d'envoi d'email via Formspree

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mojnvdwq";

export const sendOrderEmail = async (orderData) => {
  const { orderItems, formData, totalPrice } = orderData;

  // Labels pour les couleurs
  const colorLabels = {
    noir: "Noir",
    bleu: "Bleu",
    vert: "Vert",
    gris: "Gris",
    beige: "Beige",
  };

  // Formatage des articles pour l'email
  const orderItemsText = orderItems
    .map(
      (item, index) =>
        `Article ${index + 1}:
  - Couleur: ${colorLabels[item.color] || item.color}
  - Taille: ${item.size}
  - Quantité: ${item.quantity}
  - Prix unitaire: 2000 DA
  - Sous-total: ${item.quantity * 2000} DA`,
    )
    .join("\n\n");

  // Type de livraison
  const deliveryType =
    formData.deliveryType === "bureau"
      ? "Livraison au bureau"
      : "Livraison à domicile";

  // Calcul des frais
  const productsTotal = orderItems.reduce(
    (sum, item) => sum + item.quantity * 2000,
    0,
  );
  const deliveryFees = totalPrice - productsTotal;

  // Nombre total d'articles
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  // Construction du message détaillé
  const emailMessage = `
╔════════════════════════════════════════╗
║       NOUVELLE COMMANDE REÇUE          ║
╚════════════════════════════════════════╝

📋 INFORMATIONS CLIENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Nom complet    : ${formData.fullName}
📱 Téléphone      : ${formData.phone}
📍 Adresse        : ${formData.address}
🏙️  Wilaya         : ${formData.wilayaName}
🏘️  Commune        : ${formData.communeName}
🚚 Mode livraison : ${deliveryType}

🛍️ DÉTAILS DE LA COMMANDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${orderItemsText}

💰 RÉCAPITULATIF FINANCIER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total articles       : ${productsTotal} DA
Frais de livraison   : ${deliveryFees} DA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💵 TOTAL À PAYER     : ${totalPrice} DA

📊 Nombre total d'articles : ${totalItems}
📅 Date de commande : ${new Date().toLocaleString("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
  })}
  `;

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        // Informations principales
        nom: formData.fullName,
        telephone: formData.phone,
        adresse: formData.address,
        wilaya: formData.wilayaName,
        commune: formData.communeName,
        mode_livraison: deliveryType,

        // Détails financiers
        total_articles: `${productsTotal} DA`,
        frais_livraison: `${deliveryFees} DA`,
        total_a_payer: `${totalPrice} DA`,

        // Message complet formaté
        message: emailMessage,

        // Sujet de l'email
        _subject: `🛍️ Nouvelle commande - ${formData.fullName} - ${totalPrice} DA`,

        // Email de réponse (optionnel)
        _replyto: formData.email || "",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Erreur Formspree:", errorData);
      throw new Error(
        errorData.error || "Erreur lors de l'envoi de la commande",
      );
    }

    const data = await response.json();
    console.log("✅ Email envoyé avec succès via Formspree");
    return data;
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi:", error);
    throw error;
  }
};
