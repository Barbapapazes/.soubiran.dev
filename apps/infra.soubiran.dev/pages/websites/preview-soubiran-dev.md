---
id: a7aad970-5ce4-4222-9f32-e23c7712d393
title: preview.soubiran.dev
description: A website to give my sponsors an early access to upcoming writings. Built statically with Vite but protected behind a Cloudflare Worker.
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

The website [preview.soubiran.dev](https://preview.soubiran.dev) is dedicated to [my sponsors](https://soubiran.dev/sponsorship). I use it to share my upcoming writings before they are published publicly on my main website [soubiran.dev](https://soubiran.dev) as it's one of the perks for sponsoring me.

As the website replicates features from [soubiran.dev](https://soubiran.dev), sponsors will be able to comments and react to articles. Those interactions will be available publicly once the article is published on the main website. This is possible thanks to the unique identifier contained in the frontmatter of each article.

<!--

illustration of the architecture (components + data flow) (use ai to create a generic diagram components with vue flow)

 -->

## Development

Until the development of this website, I used a script that copy content from pull requests to soubiran.dev repository to conversation in the [Barbapapazes-Sponsors GitHub organization](https://github.com/Barbapapazes-Sponsors). Despite being automated, this process wasn't optimal as the content was simply put into a code block, making it hard to read, navigate, and images were not rendered.

In order to provide a better experience, I want a dedicated website, similar to [soubiran.ev](https://soubiran.dev) in terms of both design and features, but only accessible to my sponsors. I've extracted the core of [soubiran.dev](https://soubiran.dev) into two dedicated packages so building a clone of it is straightforward. Currently, the website is built with [Vite](https://vite.dev), a bunch of plugins, and [Nuxt UI](https://ui.nuxt.com). For the authentication part, I use [Better Auth](https://www.better-auth.com/) which provides an easy way to authenticate users via cookies without any backend.

However, [soubiran.dev](https://soubiran.dev) is a statically generated website, which means that it's not possible to protect it with authentication.

As I use Cloudflare as my main infrastructure provider, I decided to use a worker in front of the static website to handle authentication. Indeed, it's possible to make [worker runs first](https://developers.cloudflare.com/workers/static-assets/binding/#run_worker_first), even before serving static assets. That way, the worker can authenticate the user and serve the static assets only if the user is authorized.

At the end, the worker code is quite simple at it redirects anonymous users to GitHub for authentication, checks if the authenticated user is a sponsor, and serves the static assets if everything is fine.

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

## Deployment

Both the worker and the Vite code are contained in the same repository using a [pnpm monorepo](https://pnpm.io/workspaces). The build output of Vite is used as the static assets for the worker, configured using `wrangler.jsonc`.

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

The build and the deployment are fully automated using Cloudflare Build. First, the Vite project is build using `vite build`, and then, the worker is build using `wrangler publish`. Finally, the worker can be deployed to Cloudflare Workers platform and thanks to the configuration, the static assets are also deployed.

Now, every request to [preview.soubiran.dev](https://preview.soubiran.dev) goes through the worker which handles authentication and serves the static assets.

## Considered Alternatives

I though a lot on how to implement a custom authentication for external users in front of a static website.

> [!NOTE]
> The external is important as I can't rely on Cloudflare Access.

The first idea was to use a backend framework like [Laravel](https://laravel.com) to implement the authentication. Within its static assets folder, I could have build the static website. This was faisable but having to maintain and deploy a full backend for just authentication wasn't something I wanted to do.

The other solution was also to use Laravel but instead of generating static assets, I could have build a Markdown pipeline to render articles on-demand, after an authentication check. This solution was required more work as I had to implement the Markdown rendering within Laravel. This isn't something I want to do as I already have one for [soubiran.dev](https://soubiran.dev) and I want to reuse it as much as possible.

Cloudflare Workers naturally appeared as the best solution as everything is managed by Cloudflare, from the deployment to the production. The only thing I have to do is to write the worker code and the static website code, and Cloudflare Build takes care of the rest.
