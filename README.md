# IS117 Brand Studio

**The same white T-shirt can carry very different meanings.** Develop a brand for it with an AI collaborator, then make those decisions visible in a professional website and a live style guide.

This student project is a draft storefront for **Never Say Never**, a resilience concept. It presents one white T-shirt with FLY, FIGHT, and DREAM kanji marks, four ink colors, and a shine option for colored ink. The related style guide and design explorations document the current direction.

**Current status:** The BRAND-001 storefront and CART-001 demo-cart updates are on `main`; issues #1 and #2 are closed, and CART-001 was merged in [PR #4](https://github.com/cocv22/is117-brand-studio/pull/4). No public deployment has been verified; publishing is optional. The site is a classroom demo with no checkout, orders, payment, accounts, or persistence.

**A short record, visible to you:** your AI coach updates [LEARNING.md](LEARNING.md) with brief task-related explanations, observations and help received. It is AI-drafted, not a full transcript, and may be public with your repository. Review it and correct or remove excerpts before they are committed or pushed. Your instructor uses it alongside the project with this [simple three-part rubric](docs/assessment.md); the AI does not assign your grade.

## Start here

1. Open [this template on GitHub](https://github.com/kaw393939/is117-brand-studio), select **Use this template → Create a new repository**, and create a **public** repository in your own account. Wait until the new repository shows its README before cloning. A template copy does not copy the instructor's issues.
2. In your terminal, replace both placeholders with your account and new repository name:

   ```sh
   git clone git@github.com:USERNAME/REPOSITORY.git
   cd REPOSITORY
   ```

3. Select this cloned folder as the chat's local project in ChatGPT desktop/Codex, or another AI agent that can **read and edit local files and run terminal commands**. Have the agent report its current folder and Git remote before installing anything. A browser-only conversation cannot do the whole exercise. VS Code is optional; an editor extension or separate agent CLI is not required. Start one chat with:

   > Read AGENTS.md and SPEC.md. Help me get this running, then guide me through the brand studio one decision at a time.

4. Let the agent check Node.js **22.16+ on the 22 LTS line (recommended), or 24+**, and npm, run `npm ci` and `npm run check`, and help with any setup errors before you change the starter.
5. Return to the terminal you used to clone, still inside your repository, and run:

   ```sh
   npm run dev
   ```

   Open the address printed by the server in your browser (normally `http://127.0.0.1:5173`). Leave this terminal running while you work. The agent can edit files and run checks in its separate project terminal.

Save an HTML, CSS, JavaScript, or asset file under `public/` to refresh the local browser automatically; unsaved edits do not appear. A refresh resets the temporary cart. `npm start` is an alias for this same development mode. Press **Ctrl+C** in the terminal running the server to stop it. To switch to a plain preview, stop the server first, then use `npm run preview` and reopen its printed address. Refresh the browser yourself after saving. These commands serve your local files; publishing to GitHub Pages is a later step.

**First success checkpoint:** you can see the neutral white T-shirt page, choose a size, and add it to the cart. Tell the agent what you actually see. The cart is a demonstration; it does not take payments, persist between visits, or place orders.

If a command fails, paste the real error into the same chat. If the port is in use, let the agent help you stop your earlier preview or use `PORT=5175 npm run dev`, then open its printed address. You can ask for a hint, an example, or a small recommendation at any time. You do not need to know the branding vocabulary first.

**Returning later:** reopen the same local clone and chat. Have the agent read SPEC.md and LEARNING.md to resume the next step. Check the server terminal first; if it is still running, use its printed address. Otherwise run `npm run dev` from your repository again, reusing any chosen `PORT` prefix. You normally do not need to clone or install dependencies again.

## Work one decision at a time

The agent follows **Try → Decide → Build → Check → Keep**. It asks one small, meaningful question and waits for your answer. It should never invent your response or quietly choose your brand.

You can adopt an AI suggestion. At the important choices, explain why it helps your visitor; “yes” alone does not show that connection. Ask for a hint if you are stuck.

1. **Try the baseline.** Agree on the first feature, `BRAND-001`: first branded storefront and live style guide. Then have the agent open its issue and feature branch in **your repository**, before saving decisions or previews.
2. **Decide who and why.** Make two tiny audience/persona cards: a primary need to guide the page and one contrasting secondary need to check it. Then make an early brief: name, promise, one primary brand archetype, and three voice traits. These are hypotheses to revisit, not customer research. An archetype describes the brand's character, not a customer type.
3. **Compare two small previews.** See a modernist and a postmodernist hero using the **same product, headline, supporting copy, and action**. Each cites real design references and explains its visual decisions. Choose or adjust a direction before building the whole page.
4. **Build the chosen slice.** Develop an original SVG logo; a simple wordmark is enough. Show it at small size and in one color; the same SVG can serve each presentation if it works. Apply the selected identity to the storefront and live style guide, sharing CSS variables and assets. Plan two truthful, useful applications of Cialdini's persuasion principles; explain how one actual page element helps your visitor. Do not invent reviews, scarcity, credentials, or product facts.
5. **Check together.** The agent runs the prepared checks and reviews its work first, shows one actual check, and asks you to explain what it demonstrates. Then inspect the page in your own browser: describe the impression, try the keyboard, and look at a narrow/mobile view. Ask for help if something is unclear.
6. **Keep a change you understand.** Save agreed decisions and actual evidence in [SPEC.md](SPEC.md). Review the coach's short LEARNING.md summary for accuracy before it is committed or pushed. Then commit the checked change on its branch and review its pull request with the agent. Revise anything that misses the intended meaning. You decide when to keep and merge it into `main`; tell the agent your decision. No outside class reviewer is required.

You work at your own pace. There is no required class demonstration, quiz, separate reflection report, or extra bug-making task. The coach maintains the short learning record as you work. If you say “build it,” the agent can build the slice you have chosen; it still needs your reasons and browser observations before recording that evidence as complete.

## What is here

| File                                   | Purpose                                                                                                    |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `public/index.html`                    | BRAND-001 storefront with CART-001 demo-cart updates; merged on `main`                                      |
| `public/styleguide.html`               | Live identity board using the storefront's shared styles and assets                                        |
| `public/studio.html`                   | Short studio overview, also [available online](https://kaw393939.github.io/is117-brand-studio/studio.html) |
| [SPEC.md](SPEC.md)                     | The concise record of your chosen decisions and evidence                                                   |
| [AGENTS.md](AGENTS.md)                 | Instructions for your AI coach                                                                             |
| [LEARNING.md](LEARNING.md)             | Brief AI-drafted conversation evidence for you to review; no full transcript or automatic grade            |
| [docs/reference.md](docs/reference.md) | Short explanations and source links to use when needed                                                     |

The README is the authoritative startup path. The online overview introduces the exercise; it does not replace your local project or chat.

## Prepared checks

`npm run check` runs formatting, HTML/CSS/JavaScript lint, server tests, and a real Chromium browser journey with Playwright and axe accessibility checks. Use `npm run format` to fix formatting, then check again. Fix lint problems in the source; keep the prepared rules. If Chromium is missing, the agent can explain and run `npm run setup:browser`, then retry. That command installs the browser dependency; it is not an additional tool choice.

Positive cases check intended behavior, such as adding a selected size. Negative cases check unsuitable input, such as trying to add without a size. These are different from test **levels**: unit checks focus on a small function, integration checks join parts, and end-to-end checks drive a user journey in a real browser.

Checks can find defects and some accessibility barriers. They do not verify that the page and guide express the same identity; compare their logo, typography, components, and voice in the browser. They cannot prove that your audience will value the brand, that a claim is true, or that every person can use the site. Your own browser observation adds evidence; it does not stand in for customer research.

After `BRAND-001`, choose **one** next cycle with less guidance: perhaps a useful brand story, a fit guide with supported information, or a richer cart. A real checkout would be a separate project decision.

## Publish when you keep the site

After you approve keeping the checked change and it is merged into `main`, you can publish it. Let the agent guide you through your repository's **Settings → Pages → Source → GitHub Actions**, then **Actions → Check and publish → Run workflow** on `main`. Open the deployment URL reported by that run. Later pushes to `main` publish automatically after checks pass. Until Pages is configured, the workflow checks the project and skips publishing successfully; first setup does not require deployment.

If Settings is missing or shows a 404, sign into the owning GitHub account in that browser. Terminal SSH authentication does not sign the browser in.
