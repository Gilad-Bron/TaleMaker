# StoryForge Data Models — Design Spec (IN PROGRESS)

**Status:** In progress — Entities 1–9 finalized, resume at Entity 10 (Area)

---

## Interaction Hierarchy

**Tale → Act → Chapter → Area → Time → Interaction → Option**

---

## Context Shapes

| Level | Context Fields |
|---|---|
| Tale | universe, narrativeVoice, proseStyle, maturityRating, sourceTexts, genre, tone, setting, worldDetails, themes |
| Act | npcs, factions |
| Chapter | npcs, factions, tone, setting, themes, notes |
| Area | npcs, factions |
| Time | npcs, factions |

### Context reference shape (Act / Chapter / Area / Time)
```ts
context?: {
  npcs?:     { npcId: string, disposition?: "friendly" | "neutral" | "hostile" }[]
  factions?: { factionId: string, disposition?: "friendly" | "neutral" | "hostile" }[]
  // Chapter also includes:
  tone?:     { presets?: string[], custom?: string[] }
  setting?:  { presets?: string[], custom?: string[] }
  themes?:   { presets?: string[], custom?: string[] }
  notes?:    string
}
```

---

## Entity 1 — User

```ts
{
  id:                      string
  email:                   string
  name:                    string
  roles:                   "author" | "player" | "both"
  passwordHash:            string
  passwordResetToken?:     string
  passwordResetExpiresAt?: Date
  createdAt:               Date
}
```

---

## Entity 2 — Character

```ts
{
  id:         string
  userId:     string
  taleId?:    string
  avatarUrl?: string
  name:       string
  bio:        string
  level:      number
  experience: number
  isAlive:    boolean
  race:  { name: "human" | "elf" | "dwarf" | "orc" | "halfling" }
  class: { name: "warrior" | "wizard" | "rogue" | "druid" | "ranger" | "cleric" | "paladin" }
  abilityScores: {
    STR: number
    INT: number
    CHA: number
    DEX: number
    WIS: number
    CON: number
  }
  skills: {
    athletics:     number  // STR
    acrobatics:    number  // DEX
    stealth:       number  // DEX
    persuasion:    number  // CHA
    deception:     number  // CHA
    intimidation:  number  // CHA
    insight:       number  // WIS
    perception:    number  // WIS
    investigation: number  // INT
    arcana:        number  // INT
    lore:          number  // INT
  }
  savingThrows: {
    fortitude: number  // higher of STR or CON
    reflex:    number  // higher of DEX or INT
    will:      number  // higher of WIS or CHA
  }
  feats: {
    id:          string
    name:        string
    description: string
    effect:      { type: string, value: number }
  }[]
  health:    { current: number, max: number }
  mana:      { current: number, max: number }
  gold:      number
  inventory: InventoryItem[]
  reputation: Record<string, number>  // factionId -> value
  alignment: {
    initial:  "good" | "neutral" | "evil"
    morality: number  // good(+) <-> evil(-)
  }
  createdAt: Date
}
```

**Notes:**
- Race/class bonuses defined in constants file — applied at creation and level up
- Saving throw formula defined at implementation stage

---

## Entity 3 — InventoryItem

```ts
{
  id:          string
  name:        string
  description: string
  value?:      number  // in gold
  category:    "equipment" | "consumables" | "quest"
  type: {
    equipment:   "weapon" | "armor" | "accessory" | "misc"
    consumables: "useable" | "supplies" | "misc"
    quest:       "key" | "artifact" | "document" | "component" | "misc"
  }
  quantity:  number
  charges?:  number
  equipped:  boolean
  requirements?: {
    level?:        number
    abilityScore?: { stat: "STR" | "INT" | "CHA" | "DEX" | "WIS" | "CON", min: number }
    class?:        string[]
    race?:         string[]
  }
  passiveEffects: { target: string, field: string, delta: number }[]
  activeEffects:  { target: string, field: string, delta: number }[]
}
```

**Notes:**
- Character can only carry 1 equipped item per equipment type
- On conflict: `onEquipConflict: "storage" | "drop"` lives on Interaction entity
- `equipped` defaults to false

---

## Entity 4 — GameSession

```ts
{
  id:                   string
  userId:               string
  taleId:               string
  characterId:          string
  currentInteractionId: string
  status:               "active" | "completed" | "abandoned"
  failedOptions:        string[]
  flags:                Record<string, any>
  history:              string[]
  choices: {
    interactionId: string
    optionIdx:     number
    timestamp:     Date
  }[]
  storage:      InventoryItem[]
  startedAt:    Date
  savedAt:      Date
  completedAt?: Date
}
```

---

## Entity 5 — Tale

```ts
{
  id:           string
  authorId:     string
  title:        string
  description:  string
  status:       "draft" | "published" | "archived" | "deleted"
  visibility:   "public" | "private" | "invite"
  inviteList:   string[]
  coverImageUrl?: string
  tags:         string[]
  playCount:    number
  characterMode: "new" | "premade" | "global_premade" | "existing"
  premadeCharacterIds: string[]
  aiMode:       "a" | "b" | "c" | "d"
  context: {
    universe?: {
      preset?: "forgotten_realms" | "tolkien" | "dragonlance" | "wheel_of_time" | "game_of_thrones" | "witcher" | "dark_souls"
      custom?: string
    }
    narrativeVoice: "2nd"
    proseStyle:     "concise" | "balanced" | "rich"
    maturityRating: "pg13" | "r" | "x"
    sourceTexts?: {
      title: string
      text:  string
    }[]  // max 3,000 chars total; carries style AND lore ground truth
    genre: {
      presets?: ("fantasy" | "sci-fi" | "horror" | "mystery" | "western" | "historical" | "romance" | "thriller")[]
      custom?:  string[]
    }
    tone: {
      presets?: ("dark" | "heroic" | "comedic" | "gritty" | "whimsical" | "mysterious" | "epic" | "melancholic" | "tense")[]
      custom?:  string[]
    }
    setting: {
      presets?: ("medieval" | "futuristic" | "contemporary" | "ancient" | "post-apocalyptic" | "underwater" | "space" | "wilderness" | "urban" | "supernatural")[]
      custom?:  string[]
    }
    worldDetails: {
      geography?:  string
      history?:    string
      magic?:      string
      politics?:   string
      religion?:   string
      freeText?:   string
    }  // max 6,000 chars total
    themes: {
      presets?: ("redemption" | "power" | "betrayal" | "survival" | "identity" | "war" | "love" | "sacrifice" | "corruption" | "hope" | "revenge" | "freedom")[]
      custom?:  string[]
    }
  }
  acts:         Act[]
  createdAt:    Date
  updatedAt:    Date
  publishedAt?: Date
}
```

**Notes:**
- `universe` is UX-only — auto-populates genre/setting/tone defaults, not sent to AI
- `sourceTexts` carries both style reference AND lore ground truth
- `worldDetails` is for original world-building or canon extensions on top of sourceTexts

---

## Entity 6 — NPC

```ts
{
  id:     string
  taleId: string
  name:   string
  role: {
    preset?: "villain" | "ally" | "mentor" | "quest_giver" | "merchant" | "guard"
    custom?: string
  }
  personality: {
    presets?: ("cold" | "jovial" | "cunning" | "aggressive" | "mysterious" | "wise")[]
    custom?:  string
  }
  description: string
  avatarUrl?:  string
  createdAt:   Date
  updatedAt:   Date
}
```

**Notes:**
- Disposition is not stored on NPC — set per context reference at act/chapter/area/time level
- `role.custom` and `personality.custom` are assisted by AI writing helper (UX feature, not in data model)

---

## Entity 7 — Faction

```ts
{
  id:     string
  taleId: string
  name:   string
  role: {
    preset?: "ruling_power" | "rebels" | "guild" | "cult" | "military" | "outlaws"
    custom?: string
  }
  description: string
  createdAt:   Date
  updatedAt:   Date
}
```

**Notes:**
- Disposition is not stored on Faction — set per context reference at each level
- `role.custom` and `description` assisted by AI writing helper (UX feature, not in data model)

---

## Entity 8 — Act

```ts
{
  id:          string
  taleId:      string
  title:       string
  description: string
  order:       number
  aiMode?:     "a" | "b" | "c" | "d"
  context?: {
    npcs?:     { npcId: string, disposition?: "friendly" | "neutral" | "hostile" }[]
    factions?: { factionId: string, disposition?: "friendly" | "neutral" | "hostile" }[]
  }
  chapters:  Chapter[]
  createdAt: Date
  updatedAt: Date
}
```

**Notes:**
- Act is a structural grouping unit only — no narrative direction context

---

## Entity 9 — Chapter

```ts
{
  id:          string
  actId:       string
  taleId:      string
  title:       string
  description: string
  order:       number
  aiMode?:     "a" | "b" | "c" | "d"
  context?: {
    npcs?:     { npcId: string, disposition?: "friendly" | "neutral" | "hostile" }[]
    factions?: { factionId: string, disposition?: "friendly" | "neutral" | "hostile" }[]
    tone?: {
      presets?: ("dark" | "heroic" | "comedic" | "gritty" | "whimsical" | "mysterious" | "epic" | "melancholic" | "tense")[]
      custom?:  string[]
    }
    setting?: {
      presets?: ("medieval" | "futuristic" | "contemporary" | "ancient" | "post-apocalyptic" | "underwater" | "space" | "wilderness" | "urban" | "supernatural")[]
      custom?:  string[]
    }
    themes?: {
      presets?: ("redemption" | "power" | "betrayal" | "survival" | "identity" | "war" | "love" | "sacrifice" | "corruption" | "hope" | "revenge" | "freedom")[]
      custom?:  string[]
    }
    notes?: string
  }
  areas:     Area[]
  createdAt: Date
  updatedAt: Date
}
```

---

## Entities Pending Review

- **Entity 10 — Area** ← RESUME HERE
- **Entity 11 — Time**
- **Entity 12 — Interaction** (includes all 10 option types)

---

## Option Types (10 total)

`speak`, `action`, `skill_check`, `combat`, `rest`, `shop`, `loot`, `examine`, `reputation`, `alignment`

- `onEquipConflict: "storage" | "drop"` lives on Interaction entity

---

## AI Generation

| Mode | Description |
|---|---|
| A | Flavor only — AI adds light polish to author-written text |
| B | Dialog — AI generates NPC dialog from author structure |
| C | Full interactions — AI generates prose from author outlines |
| D | Full tale — AI generates everything from high-level structure |

- `aiMode` lives on Tale (required) and all levels below (optional override)
- Inheritance: downward — each level inherits from parent unless overridden
- Generation: on-the-fly only (pre-generation deferred)

---

## Decisions Log

| Issue | Decision |
|---|---|
| Narrative voice | Locked to 2nd person |
| Prose style | `"concise" \| "balanced" \| "rich"` |
| Content maturity | `"pg13" \| "r" \| "x"` |
| Language | English only (deferred) |
| universe field | UX-only — not sent to AI |
| sourceTexts cap | 3,000 chars total |
| sourceTexts semantic weight | Style AND lore ground truth |
| worldDetails role | Original world-building or canon extensions on top of sourceTexts |
| worldDetails cap | 6,000 chars total |
| Priority/weight signal | None — flat context, AI infers relevance |
| sourceTexts scope | Tale-level only |
| npcs/factions scope | Any level (tale-scoped entities, referenced by id at act/chapter/area/time) |
| NPC & Faction | First-class entities with ids |
| Disposition | Per-level override on context reference, not stored on entity |
| Act context | Narrow (npcs, factions only) — structural unit |
| Chapter context | Wide (npcs, factions, tone, setting, themes, notes) |
| AI writing assistant | UX/UI feature only — no data model impact |
| aiMode inheritance | Downward — each level inherits from parent unless overridden |
| Generation mode | On-the-fly only (pre-generation deferred) |
