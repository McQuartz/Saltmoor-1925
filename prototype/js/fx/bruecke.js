// Brücke: lädt pixelfx (ES-Modul, kopiert nach js/vendor/pixelfx) und die eigenen Effekte und stellt sie dem
// klassischen Spielcode als window.PixelFX bereit. Danach feuert das Ereignis 'pixelfx-bereit'.
// Einbinden: <script type="module" src="js/fx/bruecke.js"></script> (vor oder nach js/fx/effekte.js).

import { createFx, createFrame, clearFrame, actTiming, hex, luma, fit } from "../vendor/pixelfx/src/core/index.js";
import * as hitSpark from "../vendor/pixelfx/src/fx/impacts/hit-spark.js";
import * as bluntHit from "../vendor/pixelfx/src/fx/impacts/blunt-hit.js";
import * as shieldBlock from "../vendor/pixelfx/src/fx/impacts/shield-block.js";
import * as disintegrate from "../vendor/pixelfx/src/fx/spawn/disintegrate.js";
import * as eigene from "./eigene.js";

window.PixelFX = {
  createFx, createFrame, clearFrame, actTiming, hex, luma, fit,
  ersatzKoerper: eigene.ersatzKoerper,
  // nach pixelfx-Id; "saltmoor/…" sind die eigenen in js/fx/eigene.js
  fx: {
    "impacts/hit-spark": hitSpark,
    "impacts/blunt-hit": bluntHit,
    "impacts/shield-block": shieldBlock,
    "spawn/disintegrate": disintegrate,
    "saltmoor/brand": eigene.brand,
    "saltmoor/gift": eigene.gift,
    "saltmoor/geschwaecht": eigene.geschwaecht,
    "saltmoor/block-auf": eigene.blockAuf,
    "saltmoor/heilen": eigene.heilen,
    "saltmoor/hochreaktion": eigene.hochreaktion,
    "saltmoor/uebergang": eigene.uebergang,
    "saltmoor/reaktion": eigene.reaktion,
  },
};
window.dispatchEvent(new Event("pixelfx-bereit"));
