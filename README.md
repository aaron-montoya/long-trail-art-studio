# Long Trail Art Studio

Low-poly art tools for **Long Trail**, a sled dog racing card game. Everything runs in the browser; there's nothing to install.

Open `index.html` (or the GitHub Pages site) to use all the tools in one place:

| Tab | What it makes |
|---|---|
| **Dogs** | Sled dogs: breed presets, body shape, 11 coat patterns, fur, ears, poses |
| **Mushers** | Racers: presets for the Veteran, Rookie, Vet and Sprinter, hair, headwear, outfits, race bib, dog sled |
| **Gear** | Items: Snack, Booties, Dog Food, Snow Hook, Headlamp, Sled Basket, Bivy Sack, Wax the Runners, Whistle, Hot Broth, Red Lantern, Golden Harness, each with variants and colors |
| **Scenes** | Trail backgrounds: Snowfield, Spruce Forest, Mountain Pass, River Ice, Deep Powder, Exposed Ridge, with time of day, weather and card-frame export |

## Making a card

1. Build a dog, musher or gear item.
2. Click **Send to Scene**. The 3D model appears on the trail in the Scenes tab with the scene's lighting and shadows.
3. Drag it into place (scroll over it to turn it), pick the scene, time of day and camera.
   Line up the shot with **W A S D** (move), **E / Q** (up / down), **arrow keys** (look around) and **Shift** (faster).
   Drag to turn the view around the point you clicked, right-drag to pan, scroll to zoom. The camera bar under the
   view has **Reset View**, the preset viewpoints and the lens.
4. Pick the card frame in the top bar and click **Save Card PNG**. 1500 px wide is 600 dpi on a 2.5" × 3.5" poker card.

## Saving your work

- **Save Character / Load Character** stores a dog or musher as a small `.json` file.
- **Export 3D Model (.glb)** saves the posed model; add it to a scene later or open it in Blender.
- **Save PNG** saves the dog, musher or gear item alone with a transparent background.

Placed models and scene settings aren't saved between visits, so keep your `.json` and `.glb` files.

## Files

- `index.html`: the studio (tabs)
- `dog_generator.html`, `musher_generator.html`, `gear_generator.html`, `environment_generator.html`: the tools; each also works on its own
- `camkeys.js`, `studio.css`: shared camera controls and layout
- `icons.js`: shared SVG icons

Built with [three.js](https://threejs.org/) r128, loaded from a CDN.
