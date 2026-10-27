# Integrations inventory

Third-party code found on the live Squarespace site (boydinnovation.org), checked on 2026-10-27, and where each item lives in the Astro build. All public IDs are kept in [src/config/site.ts](src/config/site.ts).

## Site-wide (Squarespace Code Injection: header and footer)

| Integration | Live ID | Astro location | Status |
|---|---|---|---|
| Google Tag Manager | `GTM-KKRR74S3` | [Analytics.astro](src/components/Analytics.astro), plus the `<noscript>` iframe in [BaseLayout.astro](src/layouts/BaseLayout.astro) | Carried over, same timing (async in `<head>`) |
| Google Ads tag | `AW-18304813097` | Analytics.astro | Carried over |
| Google Ads newsletter conversion | `AW-18304813097/hQMsCNu--OMcEKmQtZhE`, fired on HubSpot form `ff76cdbb-…` submit | Analytics.astro | Carried over unchanged (legacy and v4 HubSpot form events) |
| GA4 | `G-PEHD1QDBW8` | Analytics.astro | Carried over. On Squarespace this came from the built-in Google Analytics setting (it carried Squarespace's `developer_id`). **Open question:** does GTM also fire GA4? If so, one of the two should go. |
| HubSpot tracking code | portal `50188189` | Analytics.astro | Carried over. It was included **twice** on the live site; it is now loaded once. This script also serves HubSpot pop-ups, including the "Join Our Newsletter" pop-up that opens on page load. |
| LinkedIn Insight Tag | partner IDs `7841314` **and** `7872946` | Analytics.astro | Carried over. Both IDs are kept, and the loader script now loads once instead of twice. **Open question:** is one of these IDs obsolete? |
| HubSpot CTA pop-up triggers | `217138433433` Program Interest form; `217149021356` event space inquiry; `218290064008` Carolina Ventures application | `tracking.hubspotCtas` in site.ts, rendered by [CtaButton.astro](src/components/CtaButton.astro) | The Squarespace footer script added `hs-cta-trigger-button` classes to button blocks by block ID. It's replaced by real `<button>`s that carry the class in the HTML; content files pick the pop-up by name (`hubspotCta: programInterest`). Used on /programs so far. |
| Lovable support chat widget | `bic-support-widget.lovable.app/embed.js` | Not carried over | Commented out (disabled) on the live site |
| Existing JSON-LD `LocalBusiness` | | Replaced, see [MIGRATION-NOTES.md](MIGRATION-NOTES.md) | |

## Homepage

| Integration | Details | Astro location |
|---|---|---|
| HubSpot embedded form | Newsletter form `ff76cdbb-e8b9-45fc-aae5-51f52e8ce847`, region `na1`, loaded with `js.hsforms.net/forms/embed/50188189.js` | [NewsletterSignup.astro](src/components/NewsletterSignup.astro) (site-wide, above the footer, as on the live site) |
| Coworks day pass sign-up | Outbound link `boydinnovation.coworksapp.com/day-pass-signup/429?plan=8033` | `site.dayPassUrl` in site.ts |

## Programs page

| Integration | Details | Astro location |
|---|---|---|
| HubSpot Program Interest pop-up | CTA `217138433433`: every Apply button (except Startup Sprint) and Apply Now | `hubspotCta: programInterest` in [programs.yaml](src/content/programs.yaml) |
| Startup Sprint application | Link to `/startup-sprint#application` | programs.yaml |

No page-specific Code Injection on /programs.

## Still to inventory

- Per-page Code Injection on every other page, including Eventbrite widgets, the Google Calendar subscribe button, and the pages that use the HubSpot CTA triggers. Each page will be added here as it is migrated.
