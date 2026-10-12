export const SortProductsFilter = {
  az: {
    label: 'Name (A to Z)',
    elementAttribute: 'az',
  },
  za: {
    label: 'Name (Z to A)',
    elementAttribute: 'za',
  },
  lowToHigh: {
    label: 'Price (low to high)',
    elementAttribute: 'lohi',
  },
  highToLow: {
    label: 'Price (high to low)',
    elementAttribute: 'hilo',
  },
};

export type FilterOptions = (typeof SortProductsFilter)[keyof typeof SortProductsFilter];
