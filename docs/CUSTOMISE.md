# Make your own local adventure

1. **Identity:** replace `public/handdrawn/italia-uno-logo.jpeg`, page title/favicon in `index.html`, and the name in `app/game.tsx`. Adjust the palette/font variables in `app/handdrawn.css`. Keep OFL notices if retaining bundled fonts.
2. **Place and story:** search `app/`, `lib/` and `docs/` for `Italia Uno`, `Charlotte`, `Fitzrovia`, `google.com/maps`, `fitzrovianews` and `italiauno.shop`. Replace the corresponding facts and links with your own verified material. Story facts also appear in the English/Chinese customer copy and Italian dictionaries.
3. **Menu:** edit the structured entries in `lib/menu-data.mjs`. Update the invented price schedule in `lib/customer-state.mjs` and maintain clear labelling. The three-part panino puzzle in `lib/game-state.mjs` is separate from the ordering catalogue.
4. **Artwork:** edit `lib/handdrawn-scenes.mjs` and `lib/drawing-kit.mjs`. Scenes use a 640×420 coordinate system and shared Canvas/HTML hotspot projection. The fictional chef is in `lib/chef-art.mjs`. Keep hit targets aligned with returned anchor coordinates.
5. **Music:** edit scene arrangements in `lib/music-score.mjs`; synthesis lives in `lib/cafe-music.mjs`. Keep user-gesture start, mute and hidden-tab handling.
6. **Rules:** customer and owner reducers are separate (`lib/customer-state.mjs`, `lib/service-state.mjs`). Preserve guarded transitions and immutable checkout data when changing UI.
7. **Storage:** change the `SAVE` and `PREF` keys in `app/game.tsx` for a new brand, so multiple remixes on one origin do not overwrite each other's local progress.
8. **Translations:** update English/Chinese source copy and the Italian dictionaries under `lib/it/`. English is the initial default; the picker lists Italiano first.
9. **Verify:** run `npm test` and `npm run build`. Check both a narrow phone and a desktop. Confirm that scene labels do not cover the artwork, all actions remain reachable, and receipt totals are correct.

Deploy the contents of `dist/` to a static host. The relative Vite base supports both root and subpath hosting. If using GitHub Pages, choose a build/deployment workflow or publish a generated static branch; the source directory itself is not a prebuilt site. See [GitHub's Pages setup guide](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
