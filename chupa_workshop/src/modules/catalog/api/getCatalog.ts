import { endpoints } from '@/shared/api/endpoints';
import { httpClient } from '@/shared/api/httpClient';

import { CatalogItem } from '../types/CatalogItem';

export async function getCatalog(): Promise<CatalogItem[]> {
  // Моковые данные для разработки
  return Promise.resolve([
    {
      id: '1',
      title: 'Чупа чупс классический',
      price: 50,
      slug: 'chupa-classic',
      image:
        '/images/mockProductBg.jpg',
      description: 'Классический вкус, который знаком каждому с детства.',
    },
    {
      id: '2',
      title: 'Чупа чупс с клубникой',
      price: 55,
      slug: 'chupa-strawberry',
      image:
        '/images/mockProductBg.jpg',
      description: 'Сочный и сладкий вкус спелой клубники.',
    },
    {
      id: '3',
      title: 'Чупа чупс кола',
      price: 60,
      slug: 'chupa-cola',
      image:
        '/images/mockProductBg.jpg',
      description: 'Освежающий вкус колы с легкой газированностью.',
    },
    {
      id: '4',
      title: 'Чупа чупс апельсин',
      price: 55,
      slug: 'chupa-orange',
      image:
        '/images/mockProductBg.jpg',
      description: 'Яркий цитрусовый вкус спелого апельсина.',
    },
    {
      id: '5',
      title: 'Чупа чупс вишня',
      price: 55,
      slug: 'chupa-cherry',
      image:
        '/images/mockProductBg.jpg',
      description: 'Насыщенный и терпкий вкус спелой вишни.',
    },
    {
      id: '6',
      title: 'Чупа чупс виноград',
      price: 55,
      slug: 'chupa-grape',
      image:
        '/images/mockProductBg.jpg',
      description: 'Сладкий и ароматный вкус сочного винограда.',
    },
    {
      id: '7',
      title: 'Чупа чупс лимон',
      price: 50,
      slug: 'chupa-lemon',
      image:
        '/images/mockProductBg.jpg',
      description: 'Освежающий кисло-сладкий вкус свежего лимона.',
    },
    {
      id: '8',
      title: 'Чупа чупс яблоко',
      price: 55,
      slug: 'chupa-apple',
      image:
        '/images/mockProductBg.jpg',
      description: 'Хрустящий и сочный вкус спелого яблока.',
    },
    {
      id: '9',
      title: 'Чупа чупс банан',
      price: 60,
      slug: 'chupa-banana',
      image:
        '/images/mockProductBg.jpg',
      description: 'Нежный и сладкий вкус спелого банана.',
    },
    {
      id: '10',
      title: 'Чупа чупс арбуз',
      price: 60,
      slug: 'chupa-watermelon',
      image:
        '/images/mockProductBg.jpg',
      description: 'Освежающий и сочный вкус спелого арбуза.',
    },
    {
      id: '11',
      title: 'Чупа чупс персик',
      price: 60,
      slug: 'chupa-peach',
      image:
        '/images/mockProductBg.jpg',
      description: 'Нежный и ароматный вкус спелого персика.',
    },
    {
      id: '12',
      title: 'Чупа чупс малина',
      price: 65,
      slug: 'chupa-raspberry',
      image:
        '/images/mockProductBg.jpg',
      description: 'Яркий и насыщенный вкус лесной малины.',
    },
    {
      id: '13',
      title: 'Чупа чупс черника',
      price: 65,
      slug: 'chupa-blueberry',
      image:
        '/images/mockProductBg.jpg',
      description: 'Сладкий и терпкий вкус спелой черники.',
    },
    {
      id: '14',
      title: 'Чупа чупс кокос',
      price: 70,
      slug: 'chupa-coconut',
      image:
        '/images/mockProductBg.jpg',
      description: 'Тропический вкус нежной кокосовой мякоти.',
    },
    {
      id: '15',
      title: 'Чупа чупс манго',
      price: 70,
      slug: 'chupa-mango',
      image:
        '/images/mockProductBg.jpg',
      description: 'Экзотический и сладкий вкус спелого манго.',
    },
    {
      id: '16',
      title: 'Чупа чупс ананас',
      price: 65,
      slug: 'chupa-pineapple',
      image:
        '/images/mockProductBg.jpg',
      description: 'Тропический вкус сочного и сладкого ананаса.',
    },
    {
      id: '17',
      title: 'Чупа чупс киви',
      price: 65,
      slug: 'chupa-kiwi',
      image:
        '/images/mockProductBg.jpg',
      description: 'Освежающий кисло-сладкий вкус спелого киви.',
    },
    {
      id: '18',
      title: 'Чупа чупс дыня',
      price: 60,
      slug: 'chupa-melon',
      image:
        '/images/mockProductBg.jpg',
      description: 'Нежный и сладкий вкус ароматной дыни.',
    },
    {
      id: '19',
      title: 'Чупа чупс груша',
      price: 55,
      slug: 'chupa-pear',
      image:
        '/images/mockProductBg.jpg',
      description: 'Сочный и нежный вкус спелой груши.',
    },
    {
      id: '20',
      title: 'Чупа чупс смородина',
      price: 60,
      slug: 'chupa-currant',
      image:
        '/images/mockProductBg.jpg',
      description: 'Терпкий и освежающий вкус черной смородины.',
    },
    {
      id: '21',
      title: 'Чупа чупс ежевика',
      price: 65,
      slug: 'chupa-blackberry',
      image:
        '/images/mockProductBg.jpg',
      description: 'Насыщенный и сладкий вкус спелой ежевики.',
    },
    {
      id: '22',
      title: 'Чупа чупс клюква',
      price: 60,
      slug: 'chupa-cranberry',
      image:
        '/images/mockProductBg.jpg',
      description: 'Кисло-сладкий и освежающий вкус клюквы.',
    },
    {
      id: '23',
      title: 'Чупа чупс гранат',
      price: 70,
      slug: 'chupa-pomegranate',
      image:
        '/images/mockProductBg.jpg',
      description: 'Экзотический вкус сочных зерен граната.',
    },
    {
      id: '24',
      title: 'Чупа чупс личи',
      price: 75,
      slug: 'chupa-lychee',
      image:
        '/images/mockProductBg.jpg',
      description: 'Нежный и сладкий вкус экзотического личи.',
    },
    {
      id: '25',
      title: 'Чупа чупс маракуйя',
      price: 75,
      slug: 'chupa-passionfruit',
      image:
        '/images/mockProductBg.jpg',
      description: 'Тропический кисло-сладкий вкус маракуйи.',
    },
    {
      id: '26',
      title: 'Чупа чупс гуава',
      price: 75,
      slug: 'chupa-guava',
      image:
        '/images/mockProductBg.jpg',
      description: 'Экзотический и ароматный вкус спелой гуавы.',
    },
    {
      id: '27',
      title: 'Чупа чупс мандарин',
      price: 55,
      slug: 'chupa-tangerine',
      image:
        '/images/mockProductBg.jpg',
      description: 'Сладкий и сочный вкус спелого мандарина.',
    },
    {
      id: '28',
      title: 'Чупа чупс грейпфрут',
      price: 60,
      slug: 'chupa-grapefruit',
      image:
        '/images/mockProductBg.jpg',
      description: 'Освежающий горьковато-сладкий вкус грейпфрута.',
    },
    {
      id: '29',
      title: 'Чупа чупс лайм',
      price: 55,
      slug: 'chupa-lime',
      image:
        '/images/mockProductBg.jpg',
      description: 'Освежающий и кислый вкус свежего лайма.',
    },
    {
      id: '30',
      title: 'Чупа чупс клубника-банан',
      price: 65,
      slug: 'chupa-strawberry-banana',
      image:
        '/images/mockProductBg.jpg',
      description: 'Гармоничное сочетание сладкой клубники и нежного банана.',
    },
    {
      id: '31',
      title: 'Чупа чупс тропический микс',
      price: 70,
      slug: 'chupa-tropical-mix',
      image:
        '/images/mockProductBg.jpg',
      description: 'Экзотическая смесь тропических фруктов.',
    },
    {
      id: '32',
      title: 'Чупа чупс ягодный микс',
      price: 65,
      slug: 'chupa-berry-mix',
      image:
        '/images/mockProductBg.jpg',
      description: 'Насыщенная смесь самых вкусных ягод.',
    },
    {
      id: '33',
      title: 'Чупа чупс цитрусовый микс',
      price: 60,
      slug: 'chupa-citrus-mix',
      image:
        '/images/mockProductBg.jpg',
      description: 'Освежающая смесь цитрусовых фруктов.',
    },
    {
      id: '34',
      title: 'Чупа чупс ваниль',
      price: 60,
      slug: 'chupa-vanilla',
      image:
        '/images/mockProductBg.jpg',
      description: 'Нежный и ароматный вкус натуральной ванили.',
    },
    {
      id: '35',
      title: 'Чупа чупс шоколад',
      price: 70,
      slug: 'chupa-chocolate',
      image:
        '/images/mockProductBg.jpg',
      description: 'Насыщенный и сладкий вкус молочного шоколада.',
    },
    {
      id: '36',
      title: 'Чупа чупс карамель',
      price: 65,
      slug: 'chupa-caramel',
      image:
        '/images/mockProductBg.jpg',
      description: 'Сладкий и тягучий вкус карамели.',
    },
    {
      id: '37',
      title: 'Чупа чупс кофе',
      price: 70,
      slug: 'chupa-coffee',
      image:
        '/images/mockProductBg.jpg',
      description: 'Насыщенный и бодрящий вкус ароматного кофе.',
    },
    {
      id: '38',
      title: 'Чупа чупс мятный',
      price: 60,
      slug: 'chupa-mint',
      image:
        '/images/mockProductBg.jpg',
      description: 'Освежающий и прохладный вкус свежей мяты.',
    },
    {
      id: '39',
      title: 'Чупа чупс крем-брюле',
      price: 75,
      slug: 'chupa-creme-brulee',
      image:
        '/images/mockProductBg.jpg',
      description: 'Изысканный вкус нежного крем-брюле с карамельной корочкой.',
    },
    {
      id: '40',
      title: 'Чупа чупс тирамису',
      price: 80,
      slug: 'chupa-tiramisu',
      image:
        '/images/mockProductBg.jpg',
      description: 'Изысканный вкус знаменитого итальянского десерта.',
    },
    {
      id: '41',
      title: 'Чупа чупс чизкейк',
      price: 80,
      slug: 'chupa-cheesecake',
      image:
        '/images/mockProductBg.jpg',
      description: 'Нежный и сливочный вкус классического чизкейка.',
    },
    {
      id: '42',
      title: 'Чупа чупс молочный',
      price: 55,
      slug: 'chupa-milk',
      image:
        '/images/mockProductBg.jpg',
      description: 'Нежный и сливочный вкус свежего молока.',
    },
    {
      id: '43',
      title: 'Чупа чупс клубничный йогурт',
      price: 65,
      slug: 'chupa-strawberry-yogurt',
      image:
        '/images/mockProductBg.jpg',
      description: 'Нежный вкус клубничного йогурта с кусочками ягод.',
    },
    {
      id: '44',
      title: 'Чупа чупс персиковый йогурт',
      price: 65,
      slug: 'chupa-peach-yogurt',
      image:
        '/images/mockProductBg.jpg',
      description: 'Сливочный вкус персикового йогурта.',
    },
    {
      id: '45',
      title: 'Чупа чупс голубика',
      price: 65,
      slug: 'chupa-blueberry-fruit',
      image:
        '/images/mockProductBg.jpg',
      description: 'Сладкий и нежный вкус спелой голубики.',
    },
    {
      id: '46',
      title: 'Чупа чупс абрикос',
      price: 60,
      slug: 'chupa-apricot',
      image:
        '/images/mockProductBg.jpg',
      description: 'Сладкий и ароматный вкус спелого абрикоса.',
    },
    {
      id: '47',
      title: 'Чупа чупс инжир',
      price: 70,
      slug: 'chupa-fig',
      image:
        '/images/mockProductBg.jpg',
      description: 'Экзотический и сладкий вкус спелого инжира.',
    },
    {
      id: '48',
      title: 'Чупа чупс финик',
      price: 70,
      slug: 'chupa-date',
      image:
        '/images/mockProductBg.jpg',
      description: 'Сладкий и насыщенный вкус спелых фиников.',
    },
    {
      id: '49',
      title: 'Чупа чупс хурма',
      price: 70,
      slug: 'chupa-persimmon',
      image:
        '/images/mockProductBg.jpg',
      description: 'Сладкий и нежный вкус спелой хурмы.',
    },
    {
      id: '50',
      title: 'Чупа чупс фейхоа',
      price: 75,
      slug: 'chupa-feijoa',
      image:
        '/images/mockProductBg.jpg',
      description: 'Экзотический вкус с нотками клубники и ананаса.',
    },
    {
      id: '51',
      title: 'Чупа чупс помело',
      price: 70,
      slug: 'chupa-pomelo',
      image:
        '/images/mockProductBg.jpg',
      description: 'Освежающий и сладкий вкус экзотического помело.',
    },
    {
      id: '52',
      title: 'Чупа чупс кумкват',
      price: 75,
      slug: 'chupa-kumquat',
      image:
        '/images/mockProductBg.jpg',
      description: 'Необычный кисло-сладкий вкус миниатюрного цитруса.',
    },
    {
      id: '53',
      title: 'Чупа чупс драконий фрукт',
      price: 80,
      slug: 'chupa-dragon-fruit',
      image:
        '/images/mockProductBg.jpg',
      description: 'Экзотический и нежный вкус драконьего фрукта.',
    },
    {
      id: '54',
      title: 'Чупа чупс рамбутан',
      price: 80,
      slug: 'chupa-rambutan',
      image:
        '/images/mockProductBg.jpg',
      description: 'Сладкий и сочный вкус экзотического рамбутана.',
    },
    {
      id: '55',
      title: 'Чупа чупс дуриан',
      price: 85,
      slug: 'chupa-durian',
      image:
        '/images/mockProductBg.jpg',
      description: 'Экзотический вкус короля фруктов с уникальным ароматом.',
    },
    {
      id: '56',
      title: 'Чупа чупс мангостин',
      price: 80,
      slug: 'chupa-mangosteen',
      image:
        '/images/mockProductBg.jpg',
      description: 'Нежный и сладкий вкус королевы тропических фруктов.',
    },
    {
      id: '57',
      title: 'Чупа чупс звездчатое яблоко',
      price: 75,
      slug: 'chupa-star-apple',
      image:
        '/images/mockProductBg.jpg',
      description: 'Экзотический сладкий вкус с молочными нотками.',
    },
    {
      id: '58',
      title: 'Чупа чупс сахарное яблоко',
      price: 75,
      slug: 'chupa-sugar-apple',
      image:
        '/images/mockProductBg.jpg',
      description: 'Очень сладкий и нежный вкус тропического фрукта.',
    },
    {
      id: '59',
      title: 'Чупа чупс джекфрут',
      price: 80,
      slug: 'chupa-jackfruit',
      image:
        '/images/mockProductBg.jpg',
      description: 'Экзотический вкус самого большого фрукта в мире.',
    },
    {
      id: '60',
      title: 'Чупа чупс карамбола',
      price: 75,
      slug: 'chupa-carambola',
      image:
        '/images/mockProductBg.jpg',
      description: 'Освежающий кисло-сладкий вкус звездного фрукта.',
    },
  ]);

  // Раскомментируй когда будет готов API
  // return httpClient<CatalogItem[]>(endpoints.catalog);
}
