# A2Z Rentals — Prototype

Interactive UI prototype for the A2Z residential rental management platform. Built with React + Vite + Tailwind CSS. All data is mocked — no backend required.

## What's in the prototype

| Portal | URL | Description |
|--------|-----|-------------|
| Portfolio Portal | `/pm/properties` | Portfolio Director / Manager views — properties, enquiries, applications, leases, bonds, PCR, rent |
| Public Search | `/public/search` | Tenant-facing property search and listing detail |
| Applicant Flow | `/applicant/login` | Temp access login and Form 18 application wizard |
| Tenant Portal | `/tenant/home` | Active tenant dashboard — rent, PCR, notices, bond, maintenance |

## Role switcher

The sidebar includes a **Demo Role** dropdown to switch between:

- **Portfolio Manager** — can review and shortlist applications, manage day-to-day operations
- **Portfolio Director** — all PM permissions plus final approval authority for applications

The approve/reject actions on the Application Detail screen are PD-only and reflect this split.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Lucide React (icons)
