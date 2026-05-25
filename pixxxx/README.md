# pixxxx.de

**Von Fotografen. Für Fotografen.** – Die Community-Plattform im DACH-Raum.

## Features
- Foto-Upload (JPG, PNG, TIFF, RAW) mit automatischer EXIF-Extraktion
- 4-dimensionales Bewertungssystem (Komposition, Licht, Technik, Wirkung)
- Community-Feed mit Likes, Kommentaren, Saves
- Locations-Karte für DACH (DE, AT, CH)
- Job-Board speziell für Fotografen
- XP & Level-System
- Volltext-Suche (Meilisearch)
- Dark Mode
- Analytics-Dashboard

---

## Tech-Stack

| Layer | Tool |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS v4 |
| API | tRPC v11, NextAuth v5 |
| ORM | Prisma 5 |
| Datenbank | PostgreSQL (Supabase) |
| Storage | Cloudflare R2 |
| Cache | Upstash Redis |
| Suche | Meilisearch |
| E-Mail | Resend |
| Monitoring | Sentry, PostHog |
| Deployment | Vercel |

---

## Schnellstart

### 1. Repo klonen & Abhängigkeiten installieren

```bash
git clone https://github.com/dein-user/pixxxx-de.git
cd pixxxx-de
npm install
```

### 2. Umgebungsvariablen

```bash
cp .env.example .env.local
# .env.local öffnen und Werte eintragen
```

Pflichtfelder für lokale Entwicklung:
- `DATABASE_URL` + `DIRECT_URL` → [Supabase](https://supabase.com) Projekt erstellen
- `NEXTAUTH_SECRET` → `openssl rand -base64 32`
- `R2_*` → [Cloudflare R2](https://dash.cloudflare.com) Bucket anlegen
- Mind. ein OAuth Provider (Google oder GitHub)

### 3. Datenbank einrichten

```bash
# Schema in die DB pushen (Dev)
npm run db:push

# Prisma Client generieren
npm run db:generate

# Datenbank-Studio öffnen
npm run db:studio
```

### 4. Dev-Server starten

```bash
npm run dev
# → http://localhost:3000
```

---

## Projektstruktur

```
pixxxx-de/
├── prisma/
│   └── schema.prisma          # Datenbankschema
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Feed (Homepage)
│   │   ├── photos/[id]/       # Foto-Detailseite
│   │   ├── u/[username]/      # Profil-Seite
│   │   ├── locations/         # Locations-Karte
│   │   ├── jobs/              # Job-Board
│   │   ├── upload/            # Upload-Seite
│   │   └── api/
│   │       ├── auth/          # NextAuth handler
│   │       ├── trpc/          # tRPC handler
│   │       └── upload/        # Signed URL endpoint
│   ├── components/
│   │   ├── layout/            # Navbar, Footer, Sidebar
│   │   ├── photo/             # PhotoCard, UploadForm, RatingWidget
│   │   ├── feed/              # FeedGrid, FeedFilters
│   │   └── ui/                # shadcn/ui Basiskomponenten
│   ├── lib/
│   │   ├── auth.ts            # NextAuth Konfiguration
│   │   ├── db.ts              # Prisma Singleton
│   │   ├── storage.ts         # Cloudflare R2 Helpers
│   │   ├── image.ts           # Sharp + exifr
│   │   └── trpc/
│   │       ├── router.ts      # Root tRPC Router
│   │       └── routers/
│   │           ├── photos.ts
│   │           ├── feed.ts
│   │           ├── users.ts
│   │           ├── locations.ts
│   │           └── jobs.ts
│   ├── hooks/                 # Custom React Hooks
│   └── types/
│       └── index.ts           # Geteilte TypeScript-Typen
├── .env.example
├── package.json
└── README.md
```

---

## Upload-Flow

```
1. User wählt Datei  →  Client liest EXIF (exifr)
2. POST /api/upload   →  Server gibt Signed R2 URL zurück
3. PUT {signedUrl}    →  Client lädt direkt zu R2 hoch (kein Server-Traffic)
4. tRPC photos.create →  Server speichert Metadaten in PostgreSQL
5. Background Job     →  Sharp generiert Thumbnails, Meilisearch indexiert
```

---

## Deployment

### Vercel (empfohlen)

```bash
npm i -g vercel
vercel --prod
```

Umgebungsvariablen in Vercel Dashboard eintragen (Settings → Environment Variables).

### Datenbank-Migrationen in Production

```bash
# Statt db:push immer Migrations verwenden!
npx prisma migrate deploy
```

---

## Monetarisierung (Phase 2+)

| Produkt | Preis |
|---|---|
| pixxxx FREE | 0 € – 50 MB/Monat, 100 Fotos |
| pixxxx PRO | 8 €/Monat – Unlimited, RAW-Download, Analytics |
| Job-Inserat | 49 € / 30 Tage |
| Featured Location | 29 € / Monat |

---

## Roadmap

- [x] Datenbankschema & API-Grundstruktur
- [ ] Auth (Google, GitHub, Magic Link)
- [ ] Foto-Upload mit EXIF
- [ ] Community-Feed
- [ ] Bewertungssystem
- [ ] Profil-Seiten
- [ ] Locations-Karte (Mapbox)
- [ ] Volltext-Suche
- [ ] Job-Board
- [ ] Notifications
- [ ] Analytics Dashboard
- [ ] PRO-Subscription (Stripe)
- [ ] Mobile App (React Native)

---

## Lizenz

MIT © pixxxx.de
