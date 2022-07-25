# Bromite-Block
🤔 PoC of Bromite detection. May block other misconfigured browsers as well.

Some users are really naughty, hiding their real selves from websites. Let's fix that hmm?

## Dependencies
* ESBuild
* Deno

## Running
### *nix
1. Install [Deno](https://deno.land).
2. Download the [pre-built script](dist/deno.js) `deno.js` from `dist/` or releases.
3. Run `deno run --allow-net deno.js`.

### Cloudflare Workers
Cloudflare Workers isn't supported because I'm lazy 🤪. Supporting it should be easy enough though!

### Deno Deploy
1. Create a playground on [Deno Deploy](https://deno.com/).
2. Paste and deploy the [pre-built script](dist/deno.js).

## How it works
_(last updated on 24 July 2022)_

### A little background
Bromite claims to be a privacy-respecting browser, but its actual implementations can be questionable: some causing headaches for web developers like me, and some outright exploitable to deny its access. This isn't trying to downplay their work, but to point out how they can do a little bit better.

Client hints was first introduced to Chromium 85, as a way for server to tailor resources sent to clients better. While Google claimed it as a "more privacy respecting" way than using user agent strings, I find their explanation pretty laughable: when did providing more data points to the server to fingerprint clients become privacy respecting?

Since Chromium 89, client hints was pushed as a "feature" to every installation of Chromium browsers. Some browsers based on Chromium try to spoof it, or to deny its functionality entirely. Bromite didn't do anything towards client hints at first (see the ~95 method of detection), then chose to strip it entirely. In short, Bromite's approach is wrong, and this PoC is just a way of showing why it's wrong.

### Bromite ~95
See my [Telegram channel](https://t.me/lumiere_eleve_en_Ponyville/687).

### Bromite ~103
Implemented. See my [Telegram channel](https://t.me/lumiere_eleve_en_Ponyville/688).
