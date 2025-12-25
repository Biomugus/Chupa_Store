import { endpoints } from '@/shared/api/endpoints';
import { httpClient } from '@/shared/api/httpClient';

import { CatalogItem } from '../types/CatalogItem';

export async function getCatalog(): Promise<CatalogItem[]> {
  // Моковые данные для разработки
  return Promise.resolve([
    {
      id: '1',
      title: 'Mlok-накладки "Оберег"',
      price: 4800,
      slug: 'chupa-classic',
      images:
        [ 'https://sun9-33.userapi.com/s/v1/ig2/oKVlSGuCL7rdUGdIrxvIJoWZ-iQ14Vl-LNmyQPRw-pbFR-Dp52piwjWsMwWV9BS55AgHT1dQ2g5rgASLL6kK5S-2.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,960x1280&from=bu&cs=960x0',
          'https://sun9-66.userapi.com/s/v1/ig2/qVlj38O1-Bq0AGTR56d4jv9pqx6-HQ-oLlFyElsSL3mX4P4Phkxztnc_f-qFQY1UcqLkqtAx4Ytih42MW7rhiec6.jpg?quality=95&as=32x24,48x36,72x54,108x81,160x120,240x180,360x270,480x360,540x405,640x480,720x540,1080x810,1280x960&from=bu&cs=1280x0',
          'https://sun9-41.userapi.com/s/v1/ig2/aZdVxNuQ617YC7bEjv6lbkrna5gaxh7Nx-RC30aNU2IqfCYR2Eo9fBERnumILc_iwVZ8iyxsR47rRBfFD5Cz8kJd.jpg?quality=95&as=32x24,48x36,72x54,108x81,160x120,240x180,360x270,480x360,540x405,640x480,720x540,1080x810,1280x960&from=bu&cs=1280x0',
          'https://sun9-15.userapi.com/s/v1/ig2/Dm2hG_CRw-9x5lQCduISgLBwF1qUOBzIgxKNGpOzUSMa2aitkhVnNe6f2B_y3f56vLsQFINbn0xPhtU2if8GiXvV.jpg?quality=95&as=32x24,48x36,72x54,108x81,160x120,240x180,360x270,480x360,540x405,640x480,720x540,1080x810,1280x960&from=bu&cs=1280x0'
        ],
      equipment: 'Комплектация: три дубовых накладки, крепеж, брендированная упаковка. Для чего нужен «оберег»? Накладки созданы для формирования «хватового пятна» на цевьях, имеющих M-lok интерфейс. Накладки располагаются в месте хвата, для защиты рук от нагрева цевья при стрельбе, от холодного металла зимой и т.д.',
      characteristics: 'Характеристики изделия: накладки изготовлены из массива дуба, покрыты американским минеральным маслом Minwax и тунговым маслом с воском. Длина накладки — 118 мм, три слота M-lok в длину. Вес трех накладок — 25 грамм.',
      description: 'Уникальность изделия — накладки имеют авторский дизайн с декоративной гравировкой. Набор поставляется в качественной брендированной упаковке'
    },
    {
      id: '2',
      title: 'Чупа чупс классический',
      price: 1488,
      slug: 'chupa-classic',
      images:
        [ 'https://i.pinimg.com/736x/93/14/9a/93149af131598cfe5f27f0c1a0527237.jpg',
          'https://i.pinimg.com/originals/b5/90/b2/b590b2ed84ff824dd6276fe56b901c13.jpg',
          'https://i.pinimg.com/originals/14/6d/5a/146d5af21dd54933fa66f93af04b8ee6.jpg',
          'https://i.pinimg.com/736x/ec/2d/e1/ec2de15f53b7b24dacf95b5b89b42e45.jpg'
        ],
      description: 'Классический вкус, который знаком каждому с детства.',
    },
    {
      id: '3',
      title: 'Чупа чупс классический',
      price: 3758,
      slug: 'chupa-classic',
      images:
        [ 'https://i.pinimg.com/736x/93/14/9a/93149af131598cfe5f27f0c1a0527237.jpg',
          'https://i.pinimg.com/originals/b5/90/b2/b590b2ed84ff824dd6276fe56b901c13.jpg',
          'https://i.pinimg.com/originals/14/6d/5a/146d5af21dd54933fa66f93af04b8ee6.jpg',
          'https://i.pinimg.com/736x/ec/2d/e1/ec2de15f53b7b24dacf95b5b89b42e45.jpg'
        ],
      description: 'Классический вкус, который знаком каждому с детства.',
    },
    {
      id: '4',
      title: 'Чупа чупс классический',
      price: 2500,
      slug: 'chupa-classic',
      images:
        [ 'https://i.pinimg.com/736x/93/14/9a/93149af131598cfe5f27f0c1a0527237.jpg',
          'https://i.pinimg.com/originals/b5/90/b2/b590b2ed84ff824dd6276fe56b901c13.jpg',
          'https://i.pinimg.com/originals/14/6d/5a/146d5af21dd54933fa66f93af04b8ee6.jpg',
          'https://i.pinimg.com/736x/ec/2d/e1/ec2de15f53b7b24dacf95b5b89b42e45.jpg'
        ],
      description: 'Классический вкус, который знаком каждому с детства.',
    },
    {
      id: '5',
      title: 'Чупа чупс классический',
      price: 5000,
      slug: 'chupa-classic',
      images:
        [ 'https://i.pinimg.com/736x/93/14/9a/93149af131598cfe5f27f0c1a0527237.jpg',
          'https://i.pinimg.com/originals/b5/90/b2/b590b2ed84ff824dd6276fe56b901c13.jpg',
          'https://i.pinimg.com/originals/14/6d/5a/146d5af21dd54933fa66f93af04b8ee6.jpg',
          'https://i.pinimg.com/736x/ec/2d/e1/ec2de15f53b7b24dacf95b5b89b42e45.jpg'
        ],
      description: 'Классический вкус, который знаком каждому с детства.',
    },
    {
      id: '6',
      title: 'Чупа чупс классический',
      price: 4300,
      slug: 'chupa-classic',
      images:
        [ 'https://i.pinimg.com/736x/93/14/9a/93149af131598cfe5f27f0c1a0527237.jpg',
          'https://i.pinimg.com/originals/b5/90/b2/b590b2ed84ff824dd6276fe56b901c13.jpg',
          'https://i.pinimg.com/originals/14/6d/5a/146d5af21dd54933fa66f93af04b8ee6.jpg',
          'https://i.pinimg.com/736x/ec/2d/e1/ec2de15f53b7b24dacf95b5b89b42e45.jpg'
        ],
      description: 'Классический вкус, который знаком каждому с детства.',
    },
    {
      id: '7',
      title: 'Чупа чупс классический',
      price: 8000,
      slug: 'chupa-classic',
      images:
        [ 'https://i.pinimg.com/736x/93/14/9a/93149af131598cfe5f27f0c1a0527237.jpg',
          'https://i.pinimg.com/originals/b5/90/b2/b590b2ed84ff824dd6276fe56b901c13.jpg',
          'https://i.pinimg.com/originals/14/6d/5a/146d5af21dd54933fa66f93af04b8ee6.jpg',
          'https://i.pinimg.com/736x/ec/2d/e1/ec2de15f53b7b24dacf95b5b89b42e45.jpg'
        ],
      description: 'Классический вкус, который знаком каждому с детства.',
    },
    {
      id: '8',
      title: 'Чупа чупс классический',
      price: 12600,
      slug: 'chupa-classic',
      images:
        [ 'https://i.pinimg.com/736x/93/14/9a/93149af131598cfe5f27f0c1a0527237.jpg',
          'https://i.pinimg.com/originals/b5/90/b2/b590b2ed84ff824dd6276fe56b901c13.jpg',
          'https://i.pinimg.com/originals/14/6d/5a/146d5af21dd54933fa66f93af04b8ee6.jpg',
          'https://i.pinimg.com/736x/ec/2d/e1/ec2de15f53b7b24dacf95b5b89b42e45.jpg'
        ],
      description: 'Классический вкус, который знаком каждому с детства.',
    },
    {
      id: '9',
      title: 'Чупа чупс классический',
      price: 2300,
      slug: 'chupa-classic',
      images:
        [ 'https://i.pinimg.com/736x/93/14/9a/93149af131598cfe5f27f0c1a0527237.jpg',
          'https://i.pinimg.com/originals/b5/90/b2/b590b2ed84ff824dd6276fe56b901c13.jpg',
          'https://i.pinimg.com/originals/14/6d/5a/146d5af21dd54933fa66f93af04b8ee6.jpg',
          'https://i.pinimg.com/736x/ec/2d/e1/ec2de15f53b7b24dacf95b5b89b42e45.jpg'
        ],
      description: 'Классический вкус, который знаком каждому с детства.',
    },
    {
      id: '10',
      title: 'Чупа чупс классический',
      price: 17500,
      slug: 'chupa-classic',
      images:
        [ 'https://i.pinimg.com/736x/93/14/9a/93149af131598cfe5f27f0c1a0527237.jpg',
          'https://i.pinimg.com/originals/b5/90/b2/b590b2ed84ff824dd6276fe56b901c13.jpg',
          'https://i.pinimg.com/originals/14/6d/5a/146d5af21dd54933fa66f93af04b8ee6.jpg',
          'https://i.pinimg.com/736x/ec/2d/e1/ec2de15f53b7b24dacf95b5b89b42e45.jpg'
        ],
      description: 'Классический вкус, который знаком каждому с детства.',
    },
  ]);

  // Раскомментируй когда будет готов API
  // return httpClient<CatalogItem[]>(endpoints.catalog);
}
