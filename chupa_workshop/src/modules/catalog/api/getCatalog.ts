import { endpoints } from '@/shared/api/endpoints';
import { httpClient } from '@/shared/api/httpClient';

import { CatalogItem } from '../types/CatalogItem';

export async function getCatalog(): Promise<CatalogItem[]> {
  // Моковые данные для разработки
  return Promise.resolve([
    {
      id: '1',
      title: 'Чупа чупс классический',
      price: 1485,
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
