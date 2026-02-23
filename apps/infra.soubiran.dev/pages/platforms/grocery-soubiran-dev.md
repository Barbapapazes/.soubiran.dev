---
id: 4ff2bc67-25c1-4db9-9cde-616cb7bc3351
title: grocery.soubiran.dev
description: A personal software that automatically writes my grocery list based on an image of a recipe. Built using an agent, a workflow and a LLM.
url: https://grocery.soubiran.dev
repository: https://github.com/barbapapazes/grocery.soubiran.dev
ecosystem:
---

<!-- TODO: reread and create a dedicated prompt -->
<!-- TODO: add image -->

The platform [grocery.soubiran.dev](https://grocery.soubiran.dev) is a personal software that automatically writes my grocery list based on an image of a recipe.

Before going to the supermarket, I open a book to choose my meal. Until now, I had to manually report the ingredients from the recipe to my grocery list. This was long, tedious and I often forgot to write the quantity for each ingredient. With this platform, I can simply take a picture of the recipe and automatically, the ingredients get extracted and added to my grocery list without any manual work and with all the quantities.

It is not intended for public use.

## Development

The platform has a frontend interface where I can upload an image of a recipe.

<!-- ![Frontend interface of the platform](/platforms/grocery-soubiran-dev/main-page.png) -->

Then, the image is sended to a [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/) bucket. Once uploaded, through a [Cloudflare Worker](https://workers.cloudflare.com/), the image name is sended back to the frontend.

A second request is made to the backend to trigger a [Cloudflare Agent](https://agents.cloudflare.com/). That agent is responsible to start and communicate with a [Cloudflare Workflow](https://developers.cloudflare.com/workflows/) that will perform the following steps:

1. Analyze the image using an LLM to extract the list of ingredients, their quantities and units. The LLM responds using structured output capabilities.

```ts
import { generateText, Output } from 'ai'
import { env } from 'cloudflare:workers'
import { z } from 'zod'

const image = await env.R2_BUCKET.get(imageName)

const { output } = await generateText({
  model: 'openai/gpt-5-mini',
  messages: [
    // Truncated for brevity.
    {
      role: 'user',
      content: [
        {
          type: 'image',
          image: await image.arrayBuffer(),
        }
      ]
    }
  ],
  output: Output.object({
    schema: z.object({
      items: z.array(
        z.object({
          name: z.string(),
          quantity: z.int().nullable(),
          unit: z.string().nullable(),
        }),
      ),
    }),
  }),
})
```

2. Create the grocery list in a Microsoft To-Do list by requesting the Microsoft Graph API.

```ts
for (const item of output.items) {
  const tile = `${item.name} (${item.quantity ? `${item.quantity}${item.unit ? ` ${item.unit}` : ''}` : ''})`
  await fetch('https://graph.microsoft.com/v1.0/me/todo/lists/{list-id}/tasks', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.MICROSOFT_GRAPH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
    }),
  })
}
```

3. Send a notification to my phone to inform that the grocery list is ready.
4. Delete the image from the R2 bucket to save storage.

By using a workflow, I ensure the system will retry until the process is successful without retrying successfully completed steps. Errors can occurs when asking the LLM to analyze the image or when calling the Microsoft Graph API. In both cases, the workflow is by design resilient. There is only a couple of errors that are not retryable, for example, if the authentication token is missing.

If an error occurs during the process, a notification is also sent to my phone to inform me about the failure.

<Dataflow
  :steps="[
    {
      id: 'frontend',
      label: 'Frontend',
      description: 'Allow to upload an image of a recipe',
      icon: 'frontend',
      children: [
        {
          id: 'worker',
          label: 'Cloudflare Worker',
          description: 'Store the uploaded image',
          icon: 'cloudflare-worker',
          children: [
            {
              id: 'upload-image-r2',
              label: 'Cloudflare R2',
              description: 'Contains the uploaded image',
              icon: 'cloudflare-r2'
            },
            {
              id: 'agent',
              label: 'Cloudflare Agent',
              description: 'Start and communicate with the workflow',
              icon: 'cloudflare-agent',
              children: [
                {
                  id: 'workflow',
                  label: 'Cloudflare Workflow',
                  description: 'Orchestrate resilient, retryable execution',
                  icon: 'cloudflare-workflow',
                  children: [
                    { id: 'analyze-image', label: 'Analyze Image (LLM)', description: 'Extract ingredients, quantities and units using structured output', icon: 'llm' },
                    { id: 'microsoft-graph', label: 'Microsoft Graph API', description: 'Create tasks in Microsoft To-Do from extracted ingredients', icon: 'api' },
                    { id: 'notification', label: 'Notification', description: 'Notify success or failure on the phone', icon: 'notification' },
                    { id: 'delete-image', label: 'Delete Image', description: 'Delete the image from R2 to save storage', icon: 'cloudflare-r2' }
                  ]
                }
              ]
            }
          ]
        },
      ],
    }
  ]"
/>

<!-- TODO: Make some error non retryable -->
<!-- TODO: Make the table only visible in a modal -->
<!-- TODO: Send a notification on failure and on success (for now, on discord, then, using push notification) -->
<!-- TODO: Delete image at the end of the workflow -->

### Accessing Microsoft Graph API

Microsoft does not allow to use a token to access the Graph API like we could do with GitHub for example. So, I had to implement an OAuth2 flow to get an access token and a refresh token. Both tokens are stored in a dedicated [Cloudflare KV](https://developers.cloudflare.com/kv/) storage.

> [!NOTE]
> Microsoft tokens are too long to be stored in an encrypted cookie and building a session system for a single user would be overkill.

The step in the workflow that calls the Graph API is responsible to automatically refresh the token when it is expired by using the refresh token.

> [!NOTE]
> Once out of beta, I could use the new [Cloudflare Secrets Store](https://developers.cloudflare.com/secrets-store/) instead of KV to store the tokens in a more secure way. This could also be an opportunity to extract the authentication logic to a separate worker to reuse the same authentication system across workers.

## Deployment

The platform is deployed automatically using [Cloudflare Builds](https://developers.cloudflare.com/workers/ci-cd/builds/). Every push to the main branch triggers a new deployment of the worker and the associated agent and workflow.

## Authentication

The platform is protected by [Cloudflare One](https://developers.cloudflare.com/cloudflare-one/) with an access control policy that only allows my account to access it.

This has two benefits:

1. I don't have to implement an authentication system for the platform, which simplifies the development and maintenance.
2. It ensures that only authorized users can access the platform. By acting before the request reaches the worker, it also reduces unnecessary invocations which reduce the possibility of unexpected costs.
