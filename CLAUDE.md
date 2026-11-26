# SublimeHR website, rules for every session

Static marketing site. Sources in `src/*.mjs` and `static/assets/`, built into `dist/` with `node build.mjs`. Preview only on http://localhost:4321/ (python http.server on `dist/`).

## Git
- All code goes on the `production` branch. The owner merges production into main. Push only when asked.
- Keep `backup-v1/` and the `v1-backup` tag until the owner says delete.
- End commit messages with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- `dist/` is committed too, so always run `node build.mjs` before committing.

## Skills to use on every UI task (the owner has asked for this many times)
1. `web-design-system-director`: read `design-system/MASTER.md` and `design-system/components.md` before touching any section. Use only values from them. New value, add it there first.
2. `frontend-design`: for any new look. Offer a real concept, not a tweak of the same idea.
3. `website-ui-qa-audit`: after every section change run the audit at 1440, 1024, 768, 390 and 320 and show before and after numbers.
4. Other design skills the owner installs (Emil Kowalski motion, taste-skill, Impeccable): use them as soon as they are available in the session, and say which one you used.

## What the owner has repeatedly rejected (check each point before saying "done")
- Dead space inside a box, above or below content. Fix by changing the design or the content, never by stretching height or spreading items evenly.
- Text hidden, cut or overlapping other text. Measure overlaps with `getBoundingClientRect`, do not trust the eye.
- Buttons, cards and sections that differ from their siblings. Same component, same class, same measured gaps.
- Hover-only essential content.
- A fix that treats the symptom. Find the cause first (class-name clash, filter, layer, overflow).
- Putting the same idea back in a new coat. When asked for "out of the box", research, then change the concept.
- Asking the owner to say it again. The rules in this file and in `design-system/` are the memory.

## Engineering rules
- Class names must be unique per component. These clashed and broke things before: `.go`, `.nudge`, `.menu`, `.rb`, `.ra`, `.k0` to `.k6`, `.on`. Prefix by component.
- Window resizing in the browser pane is not exact; for responsive checks load the page in an iframe of the target width and measure.
- The browser pane throttles timers and its screenshots can be stale. Verify with measurements or state, say what was not seen.
- Windows shell: the Bash tool sometimes refuses Python heredocs with a false removal warning. Write the script with the Write tool and run it.
- Reduced motion must be respected.

## Reporting
Reply in Hindi. Say what was actually verified and what was not. Do not claim a result that was only measured, not seen.

## Approved work stays as it is
Anything already built and accepted (sizes, heights, colours, gradients, effects) is not changed unless the owner asks for that exact change. Skill or audit suggestions never override an approved look; report them instead.
