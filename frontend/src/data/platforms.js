import woocommerce from "../assets/woocommerce.png";
import ebay from "../assets/ebay-text.svg";
import shopify from "../assets/shopify.png";
import bigcommerce from "../assets/big-commerce.png";
import magento from "../assets/magento.png";
import prestashop from "../assets/prestashop.png";

export const platforms = [
    {
      id: "woocommerce",
      name: "WooCommerce",
      image: woocommerce,
      imageClass: "h-16",
      available: true,
    },
    {
      id: "ebay",
      name: "eBay",
      image: ebay,
      available: false,
    },
    {
      id: "shopify",
      name: "Shopify",
      image: shopify,
      available: false,
    },
    {
      id: "bigcommerce",
      name: "BigCommerce",
      image: bigcommerce,
      available: false,
    },
    {
      id: "magento",
      name: "Magento",
      image: magento,
      available: false,
    },
    {
      id: "prestashop",
      name: "PrestaShop",
      image: prestashop,
      imageClass: "h-18",
      available: false,
    },
  ];