# Design spec: Panadería-café portfolio

*Status: foundation built (data model, plain list view, tabs, filter, sweetness). Illustrated tray, business card and real art are not built yet.*

## Concept
A single-page portfolio themed as a Mexican bakery-café (panadería). Visitors "order" from the menu. No avatar, no 3D, no walking around. Interaction is clicking, tabbing and choosing.

## Sections (tab bar)
| Tab | Hint shown | Metaphor | Content |
|---|---|---|---|
| Bread Tray | Projects | Tray of pan dulce | One bread per project |
| Drinks | Job Experience | Coffee and drinks menu | One drink per role |
| Our Story | About me | Corkboard | Owner's note, hobbies, the Valley note, photos |

Tabs follow the WAI-ARIA tabs pattern (arrow keys, Home/End, roving tabindex). One page; the active tab is mirrored in the URL hash (`#bread-tray`, `#drinks`, `#our-story`) so sections are linkable. Inactive panels use `hidden`, which removes them from the tab order.

## Interactions
- **Brew your stack:** ingredient chips (every technology used) are toggle buttons. A dish shows when it uses *all* selected ingredients. A polite live region announces the count. Applies to Bread Tray and Drinks.
- **Sweetness:** a radio group, so it is keyboard- and screen-reader-friendly. *Light* = one-line summary, *Medium* = full description, *Deep* = technical write-up (`details`). Applies to Bread Tray and Drinks.
- **View as list (planned):** when the illustrated tray exists, a global toggle swaps the tray and drinks board for the plain menu. Today the plain menu is the only view, and it is always fully readable with links to code and website.
- **Conchas tray (planned):** the tray of illustrated breads, gently swaying (CSS transform, off under `prefers-reduced-motion`, paused on hover and focus). Opening a bread shows the same content as the list item.
- **Business card (planned):** a header button opens a dialog (focus trapped, Escape closes) with a flippable cafe company card: email, GitHub, LinkedIn, resume. Real links plus a copy-email button.

## Our Story (corkboard)
Pinned items in logical DOM order: owner's note with origin (born in Reynosa, Tamaulipas; raised in McAllen, Texas), hobby cards with a photo and short description (dancing, euphonium, guitar), the Valley note (northern Mexico and the Rio Grande Valley), and loose photos. Photos are placeholders until added; each needs `photoAlt`. The culture note text is a draft marked `TODO` for me to edit.

## Content model
`src/data/projects.json`, `experiences.json`, `story.json`. Every project and job: `id`, `title`, `summary`, `description`, `details[]`, `duration`, `tech[]`, plus `website`/`code` (projects) or `company` (jobs). Deep write-ups are drafted from the existing descriptions and my notes, for me to edit; they contain no figures that weren't already in the descriptions.

## Palette
| Role | Name | Light | Dark | Contrast on background (light) |
|---|---|---|---|---|
| Background | Cream | `#FFF6E9` | `#241510` | n/a |
| Surface | Tortilla | `#F3E0C2` | `#3B2A22` | text on it 11.4:1 |
| Text | Cocoa | `#3B2218` | `#FFF1DC` | 13.7:1 |
| Accent 1 | Cempasúchil | `#B8470B` | `#F2A35C` | 5.0:1 |
| Accent 2 | Rosa mexicano | `#B0185F` | `#FF8FC0` | 6.2:1 |
| Accent 3 | Talavera | `#1F4E8C` | `#8DB8F2` | 7.8:1 |

Dark values follow the system setting (`prefers-color-scheme`). Dark contrast has not been measured yet.

## Art
Placeholders first (dashed boxes). Real art (hand-drawn or commissioned) comes later; deliver transparent PNG or SVG, confirm usage rights in writing, and add alt text for every non-decorative image.

## Build order
- [x] Data model, plain list view, tab bar, Brew your stack, sweetness, Our Story layout (placeholders)
- [ ] Business card dialog
- [ ] Illustrated tray and drinks board over the same data, plus the View as list toggle
- [ ] Real photos, Our Story copy, art
- [ ] Measure dark-theme contrast; visual pass at phone and desktop widths

## Open questions
- Brew your stack uses AND (a dish must use every selected ingredient). Switch to OR if too many selections return nothing.
- Final copy for the owner's note and the Valley note.
