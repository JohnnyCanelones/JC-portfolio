# Repository instructions

- Prefer Astro components for static content. Use React only when client-side interactivity is necessary.
- Use strict TypeScript and avoid `any`.
- Prefer semantic HTML and follow accessibility best practices.
- Use the centralized design tokens in `src/styles/global.css`; do not hardcode component colors.
- Keep content in Content Collections and configuration, separate from presentation.
- Minimize client-side JavaScript, dependencies, and premature abstractions.
- Never fabricate professional information or expose secrets or confidential information.
- Run `pnpm validate` before completing a task.
- Do not modify unrelated files.
- Do not deploy without explicit approval.
