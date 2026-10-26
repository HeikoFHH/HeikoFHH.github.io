# heikofhh.github.io

Personal website of Heiko Hoppe. Vite + React + TypeScript + Tailwind, deployed to GitHub Pages.

## Edit content
Everything (bio, news, papers, CV entries, legal address) is in `src/content/data.ts`.
Replace `public/Heiko_Hoppe_CV.pdf` and `public/heiko.jpg` to update the CV and portrait.

## Develop
```
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Deploy
Create the repo `HeikoFHH/HeikoFHH.github.io`, push to `main`, and set
Settings → Pages → Source to "GitHub Actions". `.github/workflows/deploy.yml` does the rest.

## Before going live
Fill in the `[placeholders]` in the `legal` block of `src/content/data.ts`
(address and phone for the Impressum / Privacy Policy).
