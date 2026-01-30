import { IBM_Plex_Sans, Inter, Montserrat } from 'next/font/google';

export const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['800', '900'],
  variable: '--font-montserrat',
});

export const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-inter',
});

export const ibmPlex = IBM_Plex_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '600'],
  variable: '--font-ibm-plex',
});
