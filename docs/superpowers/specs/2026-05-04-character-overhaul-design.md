# Character System Overhaul — Design Spec
**Date:** 2026-05-04
**Status:** Approved

---

## Overview

A complete overhaul of the Character entity, replacing the D&D-adjacent stat system with an archetype-based character system grounded in Carol Pearson's 12 Archetypes and Jungian psychological theory.

The new system separates four concerns:
- **Static Blueprints** — the 12 universal archetype definitions (shared, read-only)
- **Dynamic State** — the character's current live status
- **Psychological History** — the permanent ledger of growth and transformation
- **Contextual Translation** — setting-specific labels generated per world context

---

## Architecture

**2 collections:**

| Collection | Purpose |
|---|---|
| `ArchetypeDefinition` | Read-only. 12 documents shared globally. Includes world labels (SettingAdapter) embedded. |
| `Character` | One document per character. Live state + legacy layer (history, traits) + psyche embedded. |

---

## Collection 1 — ArchetypeDefinition

Read-only. 12 documents. Shared across all tales and characters.

```
{
  id:             string              // e.g., "THE_HERO"
  growthStage:    1 | 2 | 3          // 1: Ego, 2: Soul, 3: Self

  coreMotivation: string             // "Prove worth through courageous action"

  gift: {
    id:                 string
    description:        string
    targetAttribute:    "physical" | "cognitive" | "social" | "technical"
    strengthMultiplier: number        // e.g., 1.25
  }

  fear: {
    description:      string          // AI narrative context
    integrityPenalty: number          // default penalty per trigger, e.g., 0.25
  }

  shadow: {
    id:                 string        // e.g., "THE_TYRANT"
    attributeOverrides: {
      [attribute: string]: number     // e.g., { "social": -0.40, "physical": +0.15 }
    }
  }

  worldLabels: {
    [setting: string]: {              // String key — extensible without schema change
      defaultLabel: string            // e.g., "Paladin"
      shadowLabel:  string            // e.g., "Blackguard"
      description:  string
    }
  }
}
```

### World Labels

`worldLabels` uses a `String` key (not an enum) so new world contexts can be added without schema changes. When a character uses a `setting` with no existing entry, the AI generates the labels from the archetype's `coreMotivation` and `shadow.id`, then saves the result to `worldLabels` for all future characters.

### Pre-seeded World Contexts

| Archetype | FANTASY default | FANTASY shadow | SCIFI default | SCIFI shadow | NOIR default | NOIR shadow |
|---|---|---|---|---|---|---|
| THE_INNOCENT | Acolyte | Fallen Saint | Colony Dreamer | Indoctrinated Drone | Wide-Eyed Newcomer | Naive Fool |
| THE_ORPHAN | Village Wanderer | Bitter Outcast | Drifter | Burned-Out Survivor | Street Kid | Broken Soul |
| THE_HERO | Paladin | Blackguard | Space Marine | Warlord | Detective | Vigilante |
| THE_CAREGIVER | Cleric | Martyr | Field Medic | Enabler | Protector | Smothering Saint |
| THE_EXPLORER | Ranger | Exile | Scout | Rogue Agent | Drifter | Fugitive |
| THE_REBEL | Rogue | Bandit King | Hacker | Anarchist | Gunslinger | Crime Boss |
| THE_LOVER | Bard | Obsessive | Diplomat | Manipulator | Femme Fatale | Predator |
| THE_CREATOR | Artificer | Mad Tinkerer | Engineer | Saboteur | Forger | Con Artist |
| THE_JESTER | Trickster | Chaos Agent | Rogue Comedian | Nihilist | Grifter | Provocateur |
| THE_SAGE | Wizard | Manipulator | Scientist | Dogmatist | Informant | Conspiracy Theorist |
| THE_MAGICIAN | Archmage | Warlock | Quantum Engineer | Reality Hacker | Illusionist | Shadow Broker |
| THE_RULER | King | Tyrant | Admiral | Dictator | Crime Lord | Corrupt Commissioner |

---

## Collection 2 — Character

One document per character. Embeds both live state and the soul layer.

```
{
  id:         string
  userId:     string
  taleId?:    string              // null = global character

  name:       string
  bio:        string              // free text — player may include race, backstory, etc.
  avatarUrl?: string

  setting:    string              // e.g., "FANTASY", "VICTORIAN" — matches worldLabels key
  sex:        "MALE" | "FEMALE"  // determines balance.type (ANIMA / ANIMUS)

  archetypeId:    string          // → ArchetypeDefinition
  archetypeStage: 1 | 2 | 3      // current stage within active archetype

  attributes: {
    physical:   number
    cognitive:  number
    social:     number
    technical:  number
  }

  health: "healthy" | "injured" | "incapacitated" | "dead"

  psyche: {
    integrity: {
      current: number             // 0.0 to ceiling
      ceiling: number             // starts at 1.0, permanently lowers with each Fracture
    }

    balance: {
      type:        "ANIMA" | "ANIMUS"   // MALE → ANIMA, FEMALE → ANIMUS
      archetypeId: string               // → ArchetypeDefinition
      shift:       number               // 0.0 (Harmonious) to 1.0 (Hollow)
    }

    state: {
      isShadow:     boolean       // true when integrity.current < 0.55
      isFracturing: boolean       // true when integrity hits 0 — awaiting archetype choice
    }
  }

  inventory: InventoryItem[]

  legacy: {
    archetypeHistory: [           // append-only — never modified once written
      {
        archetypeId:  string
        stageReached: 1 | 2 | 3
        fracturedAt:  Date
      }
    ]

    inheritedTraits: [            // permanent echoes of past archetypes
      {
        id:              string
        sourceArchetype: string
        traitStrength:   number   // 0.20 / 0.23 / 0.26 depending on stageReached
      }
    ]
  }

  createdAt: Date
  updatedAt: Date
}
```

---

## Core Mechanics

### Attributes & Checks

The 6 D&D ability scores and 11 derived skills are replaced by 4 attributes:

| Attribute | Covers |
|---|---|
| `physical` | Strength, endurance, agility |
| `cognitive` | Intelligence, wisdom, perception |
| `social` | Charisma, persuasion, deception |
| `technical` | Crafting, mechanisms, specialized knowledge |

**Skill check:**
```
effective = attributes[targetAttribute] × gift.strengthMultiplier (if gift active)
roll: d20 + floor(effective / 2) vs author-set DC
```

**Saving throw (reactive check):**
```
Same formula — attribute chosen based on threat type
Shadow active → attributeOverrides applied before calculation
```

### Psyche System

`psyche` is the psychological spine of the character. All three sub-fields — `integrity`, `balance`, and `state` — interact with each other continuously.

#### Integrity

`psyche.integrity.current` degrades when a fear trigger fires. The `Option` entity owns the trigger:

```
// On Option entity
fearTriggers: [
  { archetypeId: "THE_HERO", penaltyOverride?: number }
]
```

When a player chooses that option, the system checks if the character's `archetypeId` matches. If yes, it applies `fear.integrityPenalty` (or `penaltyOverride`), modified by `balance.shift`.

**Integrity thresholds:**

| current | Display label | Effect |
|---|---|---|
| 0.80–ceiling | Unbroken | Gift fires at full strength |
| 0.55–0.79 | Weathered | Gift multiplier degraded |
| 0.30–0.54 | Cracking | Shadow active |
| 0.10–0.29 | Shattered | Shadow fully active |
| 0.0 | Lost | Fracture triggered — isFracturing: true |

**On Fracture:**
- Player chooses new archetype
- `archetypeHistory` entry written (immutable)
- `inheritedTraits` entry added — traitStrength by stage:
  - Stage 1 → 0.20
  - Stage 2 → 0.23  (0.20 × 1.15)
  - Stage 3 → 0.26  (0.20 × 1.30)
- `archetypeStage` resets to 1
- `integrity.ceiling` decreases by 0.05
- `integrity.current` resets to new ceiling

#### Balance (Anima / Animus)

The inner soul-image — the psychological opposite the character carries within them.

- `MALE` character → `ANIMA` (inner feminine)
- `FEMALE` character → `ANIMUS` (inner masculine)

`shift` (0.0–1.0) measures distance between the character's current archetype and their inner guide.

| shift | Display label | Effect |
|---|---|---|
| 0.0–0.25 | Harmonious | Fear softened; gift amplified; shadow suppressed; story paths unlocked |
| 0.26–0.50 | Wandering | Neutral |
| 0.51–0.75 | Divided | Fear amplified; gift degraded; shadow strengthened |
| 0.76–1.0 | Hollow | Fear maximised; gift weakened; shadow at peak power |

#### Balance Effect on All Mechanics

`balance.shift` runs through all three active systems simultaneously:

| balance.shift | Fear penalty | Gift strength | Shadow power |
|---|---|---|---|
| 0.0 — Harmonious | × 0.75 | × 1.15 | × 0.50 |
| 0.25 | × 1.00 | × 1.065 | × 0.75 |
| 0.50 — Wandering | × 1.25 | × 0.975 | × 1.00 |
| 0.75 — Divided | × 1.50 | × 0.8875 | × 1.25 |
| 1.0 — Hollow | × 1.75 | × 0.80 | × 1.50 |

**Formulas:**
```
fear_penalty    = base_penalty × (0.75 + balance.shift)
gift_multiplier = gift.strengthMultiplier × (1.15 - balance.shift × 0.35)
shadow_override = shadow.attributeOverrides[attr] × (0.50 + balance.shift)
```

### Archetype Stage Depth

Each archetype has 3 growth stages. Higher stages are reached by staying in the archetype under sustained high integrity.

| Stage | Requirement | Gift multiplier |
|---|---|---|
| 1 — Ego | Immediate | Base |
| 2 — Soul | Survive 1 full integrity cycle | +15% |
| 3 — Self | Reach Stage 2 + integrity > 0.60 sustained | +30% |

Fracturing at Stage 1 locks out Stage 2 and 3 for that archetype permanently.

### Display Labels

Raw float values are stored in the database. Labels are computed at read time:

```
integrity display:  Unbroken / Weathered / Cracking / Shattered / Lost
shift display:      Harmonious / Wandering / Divided / Hollow
```

---

## What Was Removed from the Old System

| Removed | Reason |
|---|---|
| STR / INT / CHA / DEX / WIS / CON | Replaced by 4 attributes |
| 11 derived skills | Replaced by attribute-based checks |
| Saving throws (fortitude/reflex/will) | Replaced by attribute-based reactive checks |
| Mana | Removed entirely |
| Race | Removed — player may include in bio |
| Class | Replaced by `worldLabels.defaultLabel` |
| Level / experience | Replaced by archetypeHistory + inheritedTraits |
| Feats | Replaced by inheritedTraits |
| Alignment (good/neutral/evil) | Replaced by psyche.balance.shift |
| Gold | Removed — no transactions |
| Reputation | Moved to GameSession.flags (per-tale state) |

---

## Implementation Constraints

- `ArchetypeDefinition` documents are read-only after seeding
- `legacy.archetypeHistory` entries are immutable once written — never modified, only appended
- `worldLabels` entries for unknown settings are AI-generated on first use and persisted
- `psyche.integrity.ceiling` only ever decreases — never restored
- `soul.inheritedTraits.traitStrength` is fixed at write time — never recalculated
