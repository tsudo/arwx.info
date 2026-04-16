## arwx.info — Arkansas severe weather readiness and disaster resources

Static site providing weather preparedness information, severe weather resources, and disaster readiness guidance for Arkansas residents. Deployed to [arwx.info](https://arwx.info) via GitHub Pages.

## Stack

- [Astro](https://astro.build/) static site generator
- GitHub Pages hosting with custom domain
- GitHub Actions deploy workflow

## Local Development

```bash
npm install
npm run dev
```

Preview at `http://localhost:4321`.

## Deployment

Pushes to `main` trigger the GitHub Actions deploy workflow. The site is served from the `gh-pages` branch with HTTPS enforced.

## License

Content is licensed under [CC-BY-4.0](LICENSE).
