export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(price);
};

export const capitalize = (s: string) =>
  s[0].toUpperCase() + s.slice(1).replace('_', ' ') || '';
