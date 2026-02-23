import { ProductPage } from '../../../components/product-page';

const product = {
  id: 'lipgloss-lotion-offer',
  name: '3 Lipglosses + Lotion Sample',
  price: 199,
  oldPrice: 300,
  isLimitedOffer: true,
  images: [
    '/images/lipgloss-lotion-offer-1.jpg',
    '/images/lipgloss-lotion-offer-2.jpg',
  ],
  image: '/images/lipgloss-lotion-offer-main.jpg',
  description: `Shades :\nBurgundy \nMocha \nStrawberry milk\n+ Sample 5g of our lotion for free 💞`,
  features: [
    'Includes 3 lipglosses: Burgundy, Mocha, Strawberry milk',
    'Sample 5g of our lotion for free',
    'Limited time offer',
    'Special price: 199 EGP instead of 300 EGP',
    'Shipping fees will be added at checkout',
  ],
};

export default function Page() {
  return <ProductPage product={product} />;
}
