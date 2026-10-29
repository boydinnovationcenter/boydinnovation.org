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
| HubSpot CTA pop-up triggers | `217138433433` Program Interest form; `217149021356` event space inquiry; `218290064008` Carolina Ventures application | `tracking.hubspotCtas` in site.ts, rendered by [CtaButton.astro](src/components/CtaButton.astro) | The Squarespace footer script added `hs-cta-trigger-button` classes to button blocks by block ID. It's replaced by real `<button>`s that carry the class in the HTML; content files pick the pop-up by name (`hubspotCta: programInterest`). Used on /programs, /space, /deep-dive-workshops and /programs/carolina-ventures. |
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

## Space page

| Integration | Details | Astro location |
|---|---|---|
| HubSpot event space inquiry pop-up | CTA `217149021356`, the "Inquire" button | `hubspotCta: eventSpaceInquiry` in [space.yaml](src/content/space.yaml) |
| Virtual tour embed | `https://3d.emrynvs.com/tour/boyd-innovation-center` (iframe, lazy) | [VirtualTour.astro](src/components/space/VirtualTour.astro) |
| Coworks room booking | Link to `boydinnovation.coworksapp.com/book/429?type=rooms` | space.yaml |
| Coworks day pass | Same day pass link as the homepage | space.yaml |

No page-specific Code Injection on /space.

## Events page

| Integration | Details | Astro location |
|---|---|---|
| Eventbrite checkout pop-up | Event `1995983756145` (Tech Beans), `2001623057447` (Tech on Tap, Oct 2026), loaded from `eb_widgets.js` | `eventbrite: { id, url }` in [src/content/events/](src/content/events/), wired up in [EventbriteCheckout.astro](src/components/EventbriteCheckout.astro) |
| Google Calendar subscription | Public calendar `c_5432f27d…@group.calendar.google.com`, offered for Google, Apple (webcal), Outlook.com and Office 365 | [events-page.yaml](src/content/events-page.yaml), [CalendarSubscribe.astro](src/components/events/CalendarSubscribe.astro) |
| Luma | Silicon Swamp registration link | silicon-swamp.yaml |

No page-specific Code Injection on /events; everything was in on-page code blocks.

## Book a Tour page

| Integration | Details | Astro location |
|---|---|---|
| HubSpot Meetings scheduler | `meetings.hubspot.com/kennedy-marren?embed=true`, loaded with `MeetingsEmbedCode.js` | `meetingsUrl` in [book-a-tour.yaml](src/content/book-a-tour.yaml), [book-a-tour.astro](src/pages/book-a-tour.astro) |

No page-specific Code Injection on /about or /book-a-tour.

## Tech on Tap page

| Integration | Details | Astro location |
|---|---|---|
| Eventbrite checkout pop-up | Event `2003836042545` (Tech on Tap, Nov 2026), on both Register buttons. On live, `eb_widgets.js` was loaded twice, blocking rendering, and both buttons had the same element id; it now loads once when the page is idle and each button gets its own id. | `hero.register` in [tech-on-tap.yaml](src/content/tech-on-tap.yaml), [EventbriteCheckout.astro](src/components/EventbriteCheckout.astro) |
| Recap video | Was a Squarespace-hosted video (HLS stream). Now a self-hosted MP4 in `public/video/`, with captions. | `hero.video` in tech-on-tap.yaml |

## Startup Sprint page

| Integration | Details | Astro location |
|---|---|---|
| HubSpot embedded form | Application form `08b4d195-3cbe-4e9f-96fc-2ae0953ae4c5`, region `na1`, at `#application`. Uses the same `js.hsforms.net` script as the newsletter, so it's loaded once per page instead of twice. | `application.hubspotFormId` in [startup-sprint.yaml](src/content/startup-sprint.yaml), [SprintApplication.astro](src/components/startup-sprint/SprintApplication.astro) |
| Sponsor logo marquee | A code block with JavaScript that built the scrolling logos. Rebuilt in CSS only, no script. | `sponsors` in startup-sprint.yaml, [SponsorMarquee.astro](src/components/startup-sprint/SponsorMarquee.astro) |

No page-specific Code Injection on /tech-on-tap or /startup-sprint (checked 2026-10-29).

## Still to inventory

- Per-page Code Injection on every other page, including Eventbrite widgets, the Google Calendar subscribe button, and the pages that use the HubSpot CTA triggers. Each page will be added here as it is migrated.

## Contact, Deep Dive Workshops, Carolina Ventures, Event Guide, Links (2026-10-29)

| Page | Integration | Details | Astro location |
|---|---|---|---|
| /contact | HubSpot embedded form | "Contact Us" form `01e3e8fb-62dd-4505-8cb6-ebcbc16492af`, region `na1`, rendered by the form script already loaded for the newsletter | `hubspotFormId` in [contact.yaml](src/content/contact.yaml) |
| /deep-dive-workshops | HubSpot Program Interest pop-up | CTA `217138433433` on the Apply button (live: footer script, block `yui_3_17_2_1_1784581105619_1506`) | `cta.hubspotCta: programInterest` in [deep-dive-workshops.yaml](src/content/deep-dive-workshops.yaml) |
| /programs/carolina-ventures | HubSpot Carolina Ventures application pop-up | CTA `218290064008` on Apply Now (live: footer script, block `yui_3_17_2_1_1785335815449_4259`) | `hero.cta.hubspotCta: carolinaVenturesApplication` in [carolina-ventures.yaml](src/content/carolina-ventures.yaml) |
| /links | Outbound links | YouTube channel, partnerships site, social profiles | [links.yaml](src/content/links.yaml), social links from site.ts |
| /event-guide | Outbound link | Passport Parking app (App Store) | [event-guide.yaml](src/content/event-guide.yaml) |

No page-level Code Injection was found on these pages.

