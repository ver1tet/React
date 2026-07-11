export interface IProductBrief {
  id: string;
  title: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

export const mockProducts: IProductBrief[] = [
  { id: '123-1', title: 'Смартфон X1', price: 15000, description: 'Сучасний смартфон з чудовою камерою.', imageUrl: 'https://placehold.co/150x150/png' },
  { id: '123-2', title: 'Ноутбук Pro', price: 45000 }, 
  { id: '123-3', title: 'Навушники Бездротові', price: 3000, description: 'Відмінний звук і довгий час роботи батареї.' }, 
  { id: '123-4', title: 'Планшет Tab S', price: 20000, imageUrl: 'https://placehold.co/150x150/png' }, 
  { id: '123-5', title: 'Смарт-годинник', price: 5000, description: 'Трекер активності та пульсометр.', imageUrl: 'https://placehold.co/150x150/png' },
  { id: '123-6', title: 'Павербанк 20000mAh', price: 1500 },
  { id: '123-7', title: 'Бездротова миша', price: 800, description: 'Зручна ергономічна миша для щоденної роботи.' },
  { id: '123-8', title: 'Механічна клавіатура', price: 2500, imageUrl: 'https://placehold.co/150x150/png' },
  { id: '123-9', title: 'Монітор 27"', price: 12000, description: '4K монітор для ігор та роботи.', imageUrl: 'https://placehold.co/150x150/png' },
  { id: '123-10', title: 'USB Хаб', price: 600 },
];
