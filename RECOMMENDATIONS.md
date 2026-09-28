# Shoppy personal recommendation demo

## Run locally

1. In `server`, run `npm ci`, then `node recommendations/seed.mjs` once. This adds recommendation tables, tags on 7 existing products, and 21 clearly labelled fictional demonstration products. Running the seed again does not duplicate the sample catalog.
2. Set the existing `server/.env` database and JWT configuration. Do not commit this file.
3. In `server`, run `npm start`. In `front`, run `npm ci` and `npm run dev`.
4. For the refreshed catalog, run `node recommendations/refresh-catalog.mjs` from `server` to download the public demo photographs and replace the 21 duplicate samples with matching products. Open `http://localhost:3000/recommendations` or `/products`.

## Model and ranking

The pretrained `Xenova/paraphrase-multilingual-MiniLM-L12-v2` model runs locally through Transformers.js (quantized ONNX, mean pooling, normalized 384-dimensional vectors). First use downloads public model weights. No user preferences are sent to an external inference API. Product vectors are cached on disk with a hash of model configuration and product content; query vectors use a bounded memory cache.

The candidate set excludes over-budget and disliked products. Personalized ranking blends 70% cosine similarity with 20% selected-style overlap and 10% selected-color overlap (30% style if no colors were selected). This keeps explicitly selected tags meaningful while using model-derived semantic similarity. Likes contribute 35% of the normalized preference vector; selected preferences contribute 65%. Without likes only the preference vector is used. This is inference using a pretrained model, not model training or a demonstrated recommendation-accuracy metric.

Personalized results now require at least one selected style and, when selected, one selected color to match. They must also meet cosine similarity >= 0.50. All qualifying products are returned; there is no 12-item fill target. Similar products require the source category and overlapping styles, cosine similarity >= 0.65, exclude the source and dislikes, and respect the saved budget (maximum 4). These thresholds are explicit demo heuristics, not validated accuracy claims. Reasons describe actual matching tags and the budget filter; they are not generated explanations of every model decision.

## Storage and scope

Preferences and feedback are stored in MySQL under a random, signed, HTTP-only browser cookie. They survive refresh and server restart, but are browser-specific, not account-synced. Clearing cookies starts a new profile. Do not use this guest identity design as an account-based production recommendation system without implementing account ownership and migration.

Added tables: `recommendation_tags`, `recommendation_profiles`. Existing member and cart schemas are unchanged. 21 sample products now use distinct photographs from the public DummyJSON catalog and locally curated Korean names/style labels and fictional KRW prices. Source URLs and image SHA-256 hashes are in `front/public/images/catalog/sources.json`. All 28 image files are distinct, including the 7 original products. Original product records are backed up in the ignored `server/.cache/products-before-recommendations.json`; additional catalog migration snapshots are in that same cache directory; pre-edit source is in `C:/dev/shoppy-backups/`. The Products page supports category filters, search and price sorting, with filters preserved in the URL.

Known limits: small synthetic catalog, only known product colors are tagged, no chatbot, payment approval results held only in server memory, no automatic retraining. Existing sample review count in the old product detail component is unrelated to recommendation evaluation.

## Verification

Run the Backend, then `node recommendations/verify.mjs` from `server`. It checks persisted/isolated browser profiles, budgets, likes affecting scores, exclusions, similar items, input rejection, empty results, reset, and product details. Test profiles are removed afterward. Run `npm run build` from `front`.

## Storefront refresh and feedback behavior

The storefront now uses a shared `shoppy.` wordmark and a neutral/green design across the header, footer, collection, recommendation and favorites views. The home page features four selected products rather than the full catalog. Image attribution remains in the asset manifest and this documentation rather than the shopping UI.

Search filters immediately from a local input draft, including Korean IME input; clearing the draft restores the full current category. URL updates remain on form submission to avoid interrupting composition. Category and sort filters remain URL-backed. The header displays a live favorite count after successful DB writes, hides the badge at zero, and loads the saved count on page load. Cancellation, dislike conversion and favorites-page removal all synchronize the badge without reranking the visible recommendation snapshot.

Like/dislike writes persist immediately in `recommendation_profiles.feedback` (MySQL JSON). The current recommendation snapshot only updates button states; its membership/order remains unchanged. Reloading the page or requesting a fresh recommendation applies the saved feedback. `GET /recommendations/favorites` returns all liked products for the signed browser profile regardless of recommendation thresholds/budget. The `/favorites` screen supports reviewing and removing saved likes. Preferences and favorites remain browser-scoped, not account-synced.

Run `npm test` in `front` for Korean composition, deferred feedback application, and feedback failure regression tests. The Backend verifier also checks DB-backed favorites and profile isolation.

## Payment and logout updates

Logging out removes saved likes while preserving preferences and dislikes. KakaoPay uses its PC redirect URL and localhost:9000 callbacks; approved payments return to the storefront result page with shared navigation. No ngrok tunnel is required for this local PC flow. Order persistence and automatic cart clearing are not implemented.
