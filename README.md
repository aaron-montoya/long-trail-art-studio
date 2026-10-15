# Long Trail Art Studio

Low-poly art tools for **Long Trail**, a sled dog racing card game. Everything runs in the browser; there's nothing to install.

Open `index.html` (or the GitHub Pages site) to use all the tools in one place:

| Tab | What it makes |
|---|---|
| **Dogs** | Sled dogs with a sculpted low-poly head (forehead height, stop, skull width, muzzle width, tip and depth, eye size; almond eyes with catchlights) and body (withers, keeled chest, tuck-up, haunches) under faceted fur: breed presets, body shape, 11 coat patterns, fur, ears, 11 poses (including Sore Paw and Distracted) |
| **Mushers** | Racers: presets for the Veteran, Rookie, Vet and Sprinter, hair, headwear, outfits, race bib, dog sled |
| **Gear** | Items: Snack, Booties, Mittens, Dog Food, Snow Hook, Headlamp, Sled Basket, Bivy Sack, Wax the Runners, Whistle, Hot Broth, Red Lantern, Golden Harness, Gangline (laid out or tangled), plus Wildlife: Moose and Squirrel, each with variants and colors |
| **Borders** | Fair Isle knit borders: stack bands of motifs (peeries, OXO, snowflakes, 8-point stars, reindeer, spruce trees, paw prints and more), pick a 4-color palette and a stitch (knit, cross-stitch, low-poly tiles, flat). Makes a card frame with mitered corners, a strip, or an all-over card back |
| **Banners** | Text banners: ribbon with folded tails, notched strip, plaque or hanging banner, with arch bend, hand-cut edges, low-poly facets, outline, fonts and an optional Fair Isle trim |
| **Scenes** | Trail backgrounds: Snowfield, Spruce Forest, Mountain Pass, River Ice, Deep Powder, Exposed Ridge, with time of day, weather, one-click **Events** (Clear Skies, Northern Lights, Fresh Snow, Bitter Cold, Blizzard, Whiteout, Tailwind, Overflow) outline and card effects for placed models, a **Silhouette Card** mode (all-black models on a low-poly white background), and card-frame export |

## Finding settings

Every tab's sidebar is color coded by what a section changes: **blue** shape (pose, body, item, bands), **pink** look
and colors, **cyan** text, **gold** card and effects, **green** scene and light, **orange** things placed in a scene.
At the top, type in **Find a setting** to show only the matching settings (Esc clears it), click a colored chip to
jump to a section, or use **Expand** / **Collapse**. Each tab remembers which sections you left open.

## Making a card

1. Build a dog, musher or gear item.
2. Click **Send to Scene**. The 3D model appears on the trail in the Scenes tab with the scene's lighting and shadows.
3. Drag it into place (scroll over it to turn it; Turn, Tilt, Roll and Raise sliders set any angle), pick the scene, event or time of day, and camera.
   Line up the shot with **W A S D** (move), **E / Q** (up / down), **arrow keys** (look around) and **Shift** (faster).
   Drag to turn the view around the point you clicked, right-drag to pan, scroll to zoom. The camera bar under the
   view has **Reset View**, the preset viewpoints and the lens.
4. To make a model stand out, use **Outline & effects** under the model sliders: an outline in any color, plus glow,
   focus lines, sunburst and rings behind the model and sparkles in front, all centered on the card frame and sized to it, so they stay put however close you zoom. Each model has its own settings; the looks
   (Sticker, Sparkle, Action, Legendary, Night) match the Gear tab's card styles, and **Use on all models** copies them.
5. Pick the card frame in the top bar and click **Save Card PNG**. 1500 px wide is 600 dpi on a 2.5" × 3.5" poker card.

## Silhouette cards

- **Dog tab:** open **Silhouette Card**. **Silhouette** draws the dog in one flat color (black by default); **Low-poly white
  background and card frame** puts it on a textured, faceted white card, fits the dog into the frame and adds
  **Save Card PNG** to the top bar. Save PNG gives the silhouette on a see-through background.
- **Gear tab:** tick **Silhouette** under Display, or click the **Silhouette** card style in card mode (background
  **Low-poly white (textured)**, colors 1 and 2 are the white and the facet shade). The **Mittens** item is built so
  its silhouette reads at a glance, even as a small icon.
- Export 3D and Send to Scene always keep the real colors.

The Scenes tab has the same look for everything placed in a scene: open **Silhouette Card** there. **Models all black** turns every placed dog, musher and gear item into a flat
silhouette (any color), and **Low-poly white background** swaps the trail, sky and weather for a faceted white background.
Set the facet shade, how many facets cross the card and the texture, or click **New facet layout**. Outlines, effects,
borders and banners all still work on top, and **Save Card PNG** saves it.

## Borders and banners

- **Borders tab:** start from a style (Peerie, Snowflake, Star, Reindeer...), then change the bands, colors and stitch.
  **Card frame** makes a see-through border for the card, **Strip** a single band that is a whole number of pattern repeats, so saved copies line up end to end, **Card back** the pattern over the whole card.
  Pick the same **Card frame** shape you use in the Scenes tab.
- **Banners tab:** type the text (Enter for a new line), pick a shape and a color style, and bend it into an arch if you like.
- **Save PNG** saves either one with a transparent background. **Send to Scene** puts a border on the Scenes tab's card
  (under **2D Layers & Card Border**, where you can also load a border PNG) and adds a banner as a 2D layer you can drag and resize.
  Both are included in **Save Card PNG**.

## Making a gear card

In the Gear tab, turn on **Card mode** (or click one of the card styles: Clean, Sparkle, Action, Legendary, Night, Field Guide).
Pick a background (low-poly facets, snowy, radial glow, paper, night sky, solid) and mix effects: outline, glow, sparkles,
focus lines, sunburst, rings, vignette, border and shadow. **Item size** fits the item to the card; drag to choose the angle.
Then pick the card frame in the top bar and click **Save Card PNG**.

## Saving your work

- **Save Character / Load Character** stores a dog or musher as a small `.json` file.
- **Export 3D Model (.glb)** saves the posed model; add it to a scene later or open it in Blender.
- **Save PNG** saves the dog, musher or gear item alone with a transparent background.

Placed models and scene settings aren't saved between visits, so keep your `.json` and `.glb` files.

## Files

- `index.html`: the studio (tabs)
- `dog_generator.html`, `musher_generator.html`, `gear_generator.html`, `environment_generator.html`, `border_generator.html`, `banner_generator.html`: the tools; each also works on its own
- `fairisle.js`: Fair Isle motifs and the stitch painter, shared by the Borders and Banners tabs
- `silhouette.js`: the silhouette render and the textured low-poly background, shared by the Dog, Gear and Scenes tabs
- `camkeys.js`, `studio.css`: shared camera controls and layout
- `panel.js`: the sidebar's find bar, section chips and remembered open sections
- `icons.js`: shared SVG icons

Built with [three.js](https://threejs.org/) r128, loaded from a CDN.
