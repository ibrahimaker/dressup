import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return <html lang="tr"><head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Rose · Stil Stüdyosu</title>
    <meta name="description" content="Rose'un stil günlüğü: okul, spor ve ev kombinlerini 33 özgün kıyafet, aksesuar ve makyaj seçeneğiyle tasarla." />
    <meta name="theme-color" content="#faf7f1" />
    <ScrollViewStyleReset />
  </head><body>{children}</body></html>;
}
