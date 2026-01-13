import { CatalogItem } from '../types/CatalogItem';

export async function getCatalog(): Promise<CatalogItem[]> {
  return Promise.resolve([
    {
      id: '1',
      title: 'Mlok-накладки "Оберег"',
      price: 4800,
      slug: 'mlok',
      images: [
        'https://sun9-33.userapi.com/s/v1/ig2/oKVlSGuCL7rdUGdIrxvIJoWZ-iQ14Vl-LNmyQPRw-pbFR-Dp52piwjWsMwWV9BS55AgHT1dQ2g5rgASLL6kK5S-2.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,960x1280&from=bu&cs=960x0',
        'https://sun9-66.userapi.com/s/v1/ig2/qVlj38O1-Bq0AGTR56d4jv9pqx6-HQ-oLlFyElsSL3mX4P4Phkxztnc_f-qFQY1UcqLkqtAx4Ytih42MW7rhiec6.jpg?quality=95&as=32x24,48x36,72x54,108x81,160x120,240x180,360x270,480x360,540x405,640x480,720x540,1080x810,1280x960&from=bu&cs=1280x0',
        'https://sun9-41.userapi.com/s/v1/ig2/aZdVxNuQ617YC7bEjv6lbkrna5gaxh7Nx-RC30aNU2IqfCYR2Eo9fBERnumILc_iwVZ8iyxsR47rRBfFD5Cz8kJd.jpg?quality=95&as=32x24,48x36,72x54,108x81,160x120,240x180,360x270,480x360,540x405,640x480,720x540,1080x810,1280x960&from=bu&cs=1280x0',
        'https://sun9-15.userapi.com/s/v1/ig2/Dm2hG_CRw-9x5lQCduISgLBwF1qUOBzIgxKNGpOzUSMa2aitkhVnNe6f2B_y3f56vLsQFINbn0xPhtU2if8GiXvV.jpg?quality=95&as=32x24,48x36,72x54,108x81,160x120,240x180,360x270,480x360,540x405,640x480,720x540,1080x810,1280x960&from=bu&cs=1280x0',
      ],
      equipment:
        'Комплектация: три дубовых накладки, крепеж, брендированная упаковка. Для чего нужен «оберег»? Накладки созданы для формирования «хватового пятна» на цевьях, имеющих M-lok интерфейс. Накладки располагаются в месте хвата, для защиты рук от нагрева цевья при стрельбе, от холодного металла зимой и т.д.',
      characteristics:
        'Характеристики изделия: накладки изготовлены из массива дуба, покрыты американским минеральным маслом Minwax и тунговым маслом с воском. Длина накладки — 118 мм, три слота M-lok в длину. Вес трех накладок — 25 грамм.',
      description:
        'Уникальность изделия: накладки имеют авторский дизайн с декоративной гравировкой. Набор поставляется в качественной брендированной упаковке',
    },
    {
      id: '2',
      title: 'Цевье "Румын" с Mlok планками',
      price: 5200,
      slug: 'handguard',
      images: [
        '/images/handguards/romanian2.png',
        '/images/handguards/romanian.png'
      ],
      equipment:
        'Комплектация: информация в разработке',
      characteristics:
        'Характеристики изделия: информация в разработке.',
      description:
        'Уникальность изделия: информация в разработке',
    },
    {
      id: '3',
      title: 'Цевье "Классика" с 3-мя планками Mlok',
      price: 5600,
      slug: 'handguard',
      images: [
        '/images/handguards/handguard.jpg',
      ],
      equipment:
        'Комплектация: информация в разработке',
      characteristics:
        'Характеристики изделия: информация в разработке.',
      description:
        'Уникальность изделия: информация в разработке',
    },
    {
      id: '4',
      title: 'Цевье "Укорот" с планками Mlok',
      price: 4800,
      slug: 'handguard',
      images: [
        '/images/handguards/shortening.png',
      ],
      equipment:
        'Комплектация: информация в разработке',
      characteristics:
        'Характеристики изделия: информация в разработке.',
      description:
        'Уникальность изделия: информация в разработке',
    },
    {
      id: '5',
      title: 'Mlok-накладка удлиненная',
      price: 1900,
      slug: 'mlok',
      images: [
        '/images/mlok/mlok-overlay.jpg',
      ],
      equipment:
        'Комплектация: информация в разработке',
      characteristics:
        'Характеристики изделия: информация в разработке.',
      description:
        'Уникальность изделия: информация в разработке',
    },
    {
      id: '6',
      title: 'Цевье "Упор" с планками Mlok',
      price: 5200,
      slug: 'handguard',
      images: [
        '/images/handguards/stopper.jpg',
      ],
      equipment:
        'Комплектация: информация в разработке',
      characteristics:
        'Характеристики изделия: информация в разработке.',
      description:
        'Уникальность изделия: информация в разработке',
    },
    {
      id: '7',
      title: 'Цевье "Упор 2.0" с планками Mlok',
      price: 5600,
      slug: 'handguard',
      images: [
        '/images/handguards/stopper2.0.jpg',
      ],
      equipment:
        'Комплектация: информация в разработке',
      characteristics:
        'Характеристики изделия: информация в разработке.',
      description:
        'Уникальность изделия: информация в разработке',
    },
    {
      id: '8',
      title: 'Цевье "Упор" без Mlok-интерфейса',
      price: 4200,
      slug: 'handguard',
      images: [
        '/images/handguards/shortening-without-mlok.png',
      ],
      equipment:
        'Комплектация: информация в разработке',
      characteristics:
        'Характеристики изделия: информация в разработке.',
      description:
        'Уникальность изделия: информация в разработке',
    },
    {
      id: '9',
      title: 'Пистолетная рукоять на "тонкий мотор"',
      price: 2200,
      slug: 'grip',
      images: [
        '/images/handlers/handle-thin-motor.png',
      ],
      equipment:
        'Комплектация: информация в разработке',
      characteristics:
        'Характеристики изделия: информация в разработке.',
      description:
        'Уникальность изделия: информация в разработке',
    },
    {
      id: '10',
      title: 'Пистолетная рукоять на "толстый мотор"',
      price: 2200,
      slug: 'grip',
      images: [
        '/images/handlers/handle-thick-motor.jpg',
      ],
      equipment:
        'Комплектация: информация в разработке',
      characteristics:
        'Характеристики изделия: информация в разработке.',
      description:
        'Уникальность изделия: информация в разработке',
    },
    {
      id: '11',
      title: 'Приклад "ВСС винторез"',
      price: 9800,
      slug: 'stock',
      images: [
        '/images/stocks/vss.png',
      ],
      equipment:
        'Комплектация: информация в разработке',
      characteristics:
        'Характеристики изделия: информация в разработке.',
      description:
        'Уникальность изделия: информация в разработке',
    },
  ]);

  // Раскомментируй когда будет готов API
  // return httpClient<CatalogItem[]>(endpoints.catalog);
}
