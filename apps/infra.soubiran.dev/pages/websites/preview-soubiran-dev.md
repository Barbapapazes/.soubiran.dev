---
id: a7aad970-5ce4-4222-9f32-e23c7712d393
title: preview.soubiran.dev
description: A website to give my sponsors early access to upcoming writings. Built statically with Vite but protected behind a Cloudflare Worker.
url: https://preview.soubiran.dev
repository: https://github.com/barbapapazes/preview.soubiran.dev
ecosystem:
  - type: deployment
    id: preview-soubiran-dev
    name: Cloudflare Workers
    description: Deploy the website worldwide.
    ecosystem:
      - type: build
        id: preview-soubiran-dev
        name: Cloudflare Build
        description: Build the website automatically.
        ecosystem:
          - type: repository
            id: preview.soubiran.dev
            name: GitHub
            description: Source code for the website.
            href: https://github.com/barbapapazes/preview.soubiran.dev
            ecosystem:
              - type: stack
                name: Vite
                href: https://vite.dev
              - type: stack
                name: Vue
                href: https://vuejs.org
              - type: stack
                name: Nuxt UI
                href: https://ui.nuxt.com
              - type: stack
                name: Wrangler
                href: https://developers.cloudflare.com/workers/wrangler
  - type: domain
    name: Cloudflare Domains
    description: Manage the DNS records.
  - type: realtime
    name: PartyKit
    description: Provide real-time viewer count.
---

The website [preview.soubiran.dev](https://preview.soubiran.dev) is dedicated to [my sponsors](https://soubiran.dev/sponsorship). I use it to share my **upcoming writings** before they are published publicly on my main website, [soubiran.dev](/websites/soubiran-dev), as it's one of the perks of sponsoring me. I also use it to centralize everything related to my **GitHub sponsorships**, such as announcements, exclusive articles, and more.

As the website replicates features from [soubiran.dev](/websites/soubiran-dev), sponsors will be able to comment on and react to articles. These interactions will become available publicly once the article is published on the main website. This is possible thanks to the **unique identifier** contained in the frontmatter of each article.

<Dataflow :steps="[
  { id: 'user', label: 'User Agent', description: 'Browser or client requesting the website', icon: 'user' },
  { id: 'domain', label: 'preview.soubiran.dev', description: 'Domain registered with Cloudflare', icon: 'domain' },
  { id: 'worker', label: 'Cloudflare Worker', description: 'Authenticates via GitHub OAuth and checks sponsorship status', icon: 'worker' },
  { id: 'assets', label: 'Static Assets', description: 'Vite-built website files served if authenticated', icon: 'assets' }
]" />

## Authentication with Cloudflare Workers

Before developing this website, I used a script that copied content from pull requests in the soubiran.dev repository to discussions in the [Barbapapazes-Sponsors GitHub organization](https://github.com/Barbapapazes-Sponsors). Despite being automated, this process wasn't optimal; the content was simply placed in a code block, making it hard to read and navigate, and images were not rendered.

To provide a better experience, I wanted a dedicated website similar to [soubiran.dev](/websites/soubiran-dev) in terms of both design and features. The only difference is that it is only accessible to my sponsors. I've extracted the core of [soubiran.dev](/websites/soubiran-dev) into two dedicated packages, making it straightforward to build a **clone**.

However, [soubiran.dev](/websites/soubiran-dev) is a **statically generated website (SSG)**, which means it's not possible to protect it with traditional server-side authentication.

Since I use **Cloudflare** as my main infrastructure provider, I decided to use a **Cloudflare Worker** in front of the static website to handle **authentication**. It is possible to make the [Worker run first](https://developers.cloudflare.com/workers/static-assets/binding/#run_worker_first), even before serving static assets. This way, the Worker can authenticate the user and serve the static assets only if the user is authorized.

Ultimately, the Worker code is quite simple: it redirects anonymous users to **GitHub OAuth** for authentication, checks if the authenticated user is a sponsor, and serves the static assets if everything is correct.

```ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (authRoutes(url.pathname)) {
      return auth.handler(request)
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (isAnonymous(session)) {
      return redirectToGitHub(request)
    }

    if (!hasAccess(session)) {
      return tryGiveAccess(request)
    }

    return env.ASSETS.fetch(request) // [!code highlight]
  },
}
```

Within the "try to give access" function, a **circuit breaker** is implemented to automatically stop checking for sponsorship if the **GitHub API** is down or rate-limited, ensuring the website remains resilient.

## Automated Deployment Pipeline

Both the Worker and the **Vite** code are contained in the same repository using a [pnpm monorepo](https://pnpm.io/workspaces). The Vite build output is used as the static assets for the Worker, configured via `wrangler.jsonc`.

```jsonc
{
  "name": "preview-soubiran-dev",
  "main": "src/worker.ts",
  "assets": {
    "directory": "../dist", // Vite build output
    "binding": "ASSETS",
    "run_worker_first": true
  }
}
```

The build and deployment are fully automated using **Cloudflare Build**. First, the Vite project is built using `vite build`, and then the Worker is built using `wrangler deploy`. Finally, the Worker is deployed to the **Cloudflare Workers platform**, and thanks to the configuration, the static assets are deployed alongside it.

Now, every request to [preview.soubiran.dev](https://preview.soubiran.dev) goes through the Worker, which handles **identity management** and serves the static assets.

## Considered Alternatives for Protected Static Sites

I thought a lot about how to implement **custom authentication** for external users in front of a static website.

> [!NOTE]
> The "external" part is important as I can't rely on Cloudflare Access for non-team members.

The first idea was to use a backend framework like **Laravel** to implement the authentication. I could have built the static website within its static assets folder. This was feasible, but maintaining and deploying a full backend just for authentication wasn't something I wanted to do for [infra.soubiran.dev](/websites/infra-soubiran-dev).

Another solution was also to use Laravel, but instead of generating static assets, I could have built a **Markdown pipeline** to render articles on-demand after an authentication check. This solution required more work, as I would have had to implement Markdown rendering within Laravel. This isn't something I want to do, as I already have a pipeline for [soubiran.dev](/websites/soubiran-dev) and I want to reuse it as much as possible.

**Cloudflare Workers** naturally appeared as the best solution to my problem, as everything is managed by Cloudflare, from deployment to production. The only thing I have to do is write the Worker and static website code, and Cloudflare Build takes care of the rest.
