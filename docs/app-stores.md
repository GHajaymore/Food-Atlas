# Getting WikiFoodia onto the App Store and Google Play

Written 2026-09-18. What is done, what it costs, and the exact steps that need Ajay.

## What version 1 is: the atlas, browse-only

The phone apps are the atlas — every record, every photograph, search, the Food Atlas,
twelve languages — without sign-in and without proposing a dish. Those stay on the website.

That is a deliberate choice, not a gap. Two App Store rules apply to any app that offers
accounts:

- **Guideline 4.8** — an app that signs people in with Google must also offer Sign in with
  Apple (or an equivalent privacy-preserving login).
- **Guideline 5.1.1(v)** — an app that lets people create an account must let them delete
  it from inside the app. WikiFoodia has no account deletion.

A browse-only app is subject to neither. Proposing a dish is also the part that most needs
the website's review flow, so nothing a reader can do is lost — the app links out for it.

It also means the app **collects no data at all**: the anonymous view counter only runs
where proposals are enabled. The App Store privacy label can say *Data Not Collected*, and
the Play Store data-safety form can say *No data collected or shared*. Both are true.

## What is already done (free, in the repo)

| | |
|---|---|
| `eas.json` | Build profiles. Phone builds read their data from `https://wikifoodia.ajailabs.app` and have the proposals address empty, which turns sign-in, proposing and the counter off. The web build is untouched. |
| Bundles verified | `expo export --platform android --platform ios` compiles both (9.8 MB / 9.5 MB) with the data address baked in. **Not yet run on a device** — that needs the build service below. |
| Store identifier | `app.ajailabs.wikifoodia` for both stores. Permanent from the first upload; matches the domain actually owned. It was `com.wikifoodia.app`, a domain not owned. |
| App icon | 1024×1024 with its unused alpha channel removed — pixel-identical, and Apple rejects a store icon that carries one. |
| Encryption | `ITSAppUsesNonExemptEncryption: false` — HTTPS only, so no export-compliance question on every upload. |
| Privacy policy | Live at https://wikifoodia.ajailabs.app/privacy — both stores require the URL. |
| Web-only code | Every browser-only call was checked; all are already guarded, so none runs on a phone. |

## What it costs — flagged before anything is spent

| | Cost | When |
|---|---|---|
| Apple Developer Program | **$99 / year** | Required to publish on the App Store at all. |
| Google Play developer account | **$25 once** | Required to publish on Google Play. Google also requires **identity verification**, and a **new personal account must run a closed test with at least 12 testers for 14 days** before it can publish to everyone. An organisation account avoids that but needs a D-U-N-S number. |
| Expo (EAS) account | **Free** | Builds the apps in the cloud. The free plan has a monthly build allowance, which is plenty for this. iOS cannot be built on Windows without it. |

Nothing here is metered: none of it scales with readers, and the apps call nothing that
bills (the one billable thing in the stack, Workers AI, is not reachable from them).

## Ajay's steps, in order

Use the same identity the rest of the migration uses — `admin@ajailabs.app` — for all of
these. None of it touches the WikiFoodia owner seat, which is a separate Google decision.

1. **Expo account** (free) at https://expo.dev/signup. Then, in this folder:
   ```bash
   npx eas-cli login
   ```
   ```bash
   npx eas-cli init
   ```
   `init` links the project and writes its id into `app.json`.
2. **A test build for your own phone**, before paying for anything:
   ```bash
   npx eas-cli build --profile preview --platform android
   ```
   It produces an APK you install directly. This is the first time the app runs on a real
   device — check it loads records, photographs and search before going further.
3. **Google Play** — create the developer account ($25, identity verification), create the
   app with package `app.ajailabs.wikifoodia`, then:
   ```bash
   npx eas-cli build --profile production --platform android
   ```
   ```bash
   npx eas-cli submit --platform android
   ```
   Start in the **closed testing** track; that is where the 12-tester, 14-day rule is met.
4. **Apple** — enrol in the Developer Program ($99/yr). Then:
   ```bash
   npx eas-cli build --profile production --platform ios
   ```
   ```bash
   npx eas-cli submit --platform ios
   ```
   EAS creates the signing certificates for you. Apple review usually takes one to three days.

## The store listing — I can draft all of this

Name, subtitle, description, keywords, category (Food & Drink), age rating (4+ / Everyone:
no user content in the app, no ads, no purchases), privacy answers as above, support URL
(https://wikifoodia.ajailabs.app/support), and screenshots — which need the device build
from step 2 to exist first.

## Why not wait for sign-in in the app

It can come later as version 1.1, and it would need three things built: a native OAuth
redirect (the current flow relies on a browser cookie), Sign in with Apple beside Google,
and in-app account deletion. Worth doing once people are actually proposing dishes on the
website — which depends on Search Console, not on the apps.
