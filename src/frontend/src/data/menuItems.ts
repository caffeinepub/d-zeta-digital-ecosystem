export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  prices: {
    hot?: string;
    ice?: string;
    default?: string;
  };
}

export const menuCategories = [
  'Signature Drink',
  'Signature Alternative Brew',
  'Signature Modern Drink',
  'Coffee',
  'Tea',
  'Non Coffee',
  'Light Bites',
  'Savory',
  'Sweet Bites',
  'Artisan Bread',
  'Artisan Savory',
] as const;

export const menuItems: MenuItem[] = [
  {
    id: 'yuenyeung-classic',
    name: 'Yuenyeung Classic',
    category: 'Signature Drink',
    description:
      'A blend of black coffee and black tea Hong Kong style with a creamy milk touch. Bitter, astringent, and subtly sweet in one sip. Strange in concept, delightful in taste.',
    prices: {
      hot: '23K',
      ice: '25K',
    },
  },
  {
    id: 'date-seed-latte',
    name: 'Date Seed Latte (Kopi Biji Kurma)',
    category: 'Signature Alternative Brew',
    description:
      'A beverage made from roasted date seeds, caffeine-free. Nutty and warm flavor, perfect for those who want to enjoy "coffee" without the jitters.',
    prices: {
      hot: '22K',
      ice: '24K',
    },
  },
  {
    id: 'dual-brew-aren',
    name: 'Dual Brew Aren',
    category: 'Signature Modern Drink',
    description:
      'Yuenyeung local version with a touch of palm sugar. Smoother, more Indonesian palate-friendly.',
    prices: {
      ice: '27K',
    },
  },
  {
    id: 'kopi-susu-aren',
    name: 'Kopi Susu Aren',
    category: 'Coffee',
    description: 'Espresso, milk, and palm sugar. Safe, classic, always reliable.',
    prices: {
      default: '20K',
    },
  },
  {
    id: 'americano',
    name: 'Americano',
    category: 'Coffee',
    description: 'Light black coffee with clean character and elegant bitterness.',
    prices: {
      default: '18K',
    },
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category: 'Coffee',
    description: 'Espresso with milk and soft foam.',
    prices: {
      default: '22K',
    },
  },
  {
    id: 'teh-susu-classic',
    name: 'Teh Susu Classic',
    category: 'Tea',
    description: 'Black tea with creamy milk, light and comfortable.',
    prices: {
      default: '17K',
    },
  },
  {
    id: 'chocolate-latte',
    name: 'Chocolate Latte',
    category: 'Non Coffee',
    description: 'Rich chocolate with warm milk. Suitable for all ages.',
    prices: {
      default: '22K',
    },
  },
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    category: 'Non Coffee',
    description: 'Creamy matcha with soft earthy flavor.',
    prices: {
      default: '23K',
    },
  },
  {
    id: 'butter-waffle',
    name: 'Butter Waffle',
    category: 'Light Bites',
    description: 'Crispy waffle on the outside, soft inside, served with butter and palm sugar.',
    prices: {
      default: '22K',
    },
  },
  {
    id: 'waffle-telur-keju',
    name: 'Waffle Telur & Keju',
    category: 'Savory',
    description: 'Savory waffle with egg and melted cheese. Simple but addictive.',
    prices: {
      default: '25K',
    },
  },
  {
    id: 'buttermilk-pancake',
    name: 'Buttermilk Pancake',
    category: 'Sweet Bites',
    description: 'Fluffy pancake with maple syrup or palm sugar.',
    prices: {
      default: '20K',
    },
  },
  {
    id: 'sourdough-toast-butter',
    name: 'Sourdough Toast Butter',
    category: 'Artisan Bread',
    description: 'Naturally fermented bread with warm butter. Fragrant, slightly sour, and more characterful.',
    prices: {
      default: '20K',
    },
  },
  {
    id: 'sourdough-telur-orak-arik',
    name: 'Sourdough Telur Orak-arik',
    category: 'Artisan Savory',
    description: 'Toasted sourdough with soft scrambled eggs and a bit of black pepper.',
    prices: {
      default: '25K',
    },
  },
];

export function getMenuItemsByCategory(category: string): MenuItem[] {
  return menuItems.filter((item) => item.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(menuItems.map((item) => item.category)));
}
