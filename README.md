# Rose · Stil Stüdyosu

17 yaşındaki kurgusal lise öğrencisi Rose için okul, spor ve ev kombinleri oluşturun.
Animasyonlu açılışta **Oyuna başla**; kıyafet seçiminden sonra **Kombini bitir** düğmesini kullanın.
Tamamlanan kombini düzenleyebilir veya yeni oyuna başlayabilirsiniz. **Bana ilham ver** rastgele kombin oluşturur; **Geri al** son seçimi geri getirir.

33 özgün, katmanlı vektör seçenek: 9 üst, 7 alt, 6 ayakkabı, 6 aksesuar, 5 makyaj.
Üç hazır stil arka planı da değiştirir. Her kategorideki parçalar birbiriyle serbestçe eşleştirilebilir.
Çizimlerin ayrı SVG dosyaları `assets/wardrobe/` içinde; kaynakları `src/wardrobe.ts` dosyasındadır.
`npm run assets:export` çizimleri doğrular ve ayrı SVG dosyalarını yeniden üretir.
Azaltılmış hareket tercihi desteklenir. Kombinler bu sürümde oturum belleğinde tutulur; sayfa yenilenince sıfırlanır.

Expo Router, TypeScript ve React Native ile geliştirilen, web/iOS/Android uyumlu bebek giydirme oyunu.

## Yerelde çalıştırma

Node.js'in güncel LTS sürümünü kurun, ardından:

```bash
npm install
npm run web
```

## Cloudflare Pages: GitHub push → web yayını

Bu depoyu Cloudflare Pages'e **bir kez** bağlamak yeterlidir; bundan sonra `main` dalına her push otomatik olarak web sürümünü üretir ve dağıtır. Bu yöntem GitHub'a Cloudflare anahtarı koymayı gerektirmez.

1. Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git** seçin.
2. GitHub hesabını bağlayın ve `ibrahimaker/dressup` deposunu seçin.
3. Production branch olarak `main` seçin.
4. Build command alanına `npx expo export --platform web`, build output directory alanına `dist` yazın.
5. **Save and Deploy** ile ilk yayını başlatın. Cloudflare, size `https://<proje-adı>.pages.dev` adresini verir.

Pull request'ler için Cloudflare önizleme adresi de üretir. Bu projedeki GitHub kontrolü her PR'de aynı web export işlemini ayrıca doğrular.

## EAS ile iOS / Android build

`app.json` içindeki EAS proje kimliği `5b9cdb83-eab5-4df8-853c-39941d7c46f8` olarak ayarlanmıştır. Expo hesabında bu proje kimliğine erişimi olan bir kullanıcıyla giriş yapın:

```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile preview
npx eas-cli@latest build --platform ios --profile production
```

GitHub üzerinden manuel mobil build başlatmak için repo ayarlarında **Settings → Secrets and variables → Actions** bölümünden `EXPO_TOKEN` ekleyin. Token'ı Expo Dashboard → Account settings → Access tokens bölümünden oluşturun. Ardından Actions → **EAS mobile build** → Run workflow menüsünden platformu seçin. Otomatik mobil build varsayılan olarak kapalıdır; ücret/kota tüketimini istemeden başlatmaz.

## Dağıtım özeti

| Olay | Sonuç |
| --- | --- |
| `main` dalına push | Cloudflare Pages web export eder ve yayına alır |
| Pull request | GitHub Actions web export'u doğrular; Cloudflare preview oluşturur |
| Actions'tan EAS workflow çalıştırma | Seçilen iOS/Android bulut build'i başlar |
