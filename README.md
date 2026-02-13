wordcut-ts
=======

TypeScript-first fork of wordcut: Thai word segmentation library for Node.js projects.


Installation
------------

```
npm install wordcut-ts
```

Requirements
------------

- Node.js 20 / 22 / ≥24


Usage (Library)
---------------

TypeScript:

```ts
import createWordcut, { cut } from "wordcut-ts";

const wordcut = createWordcut();
const segmented = wordcut.cut("ฉันชอบกินข้าว");
const quick = cut("กากา");
```

TypeScript with custom dictionary:

```ts
import createWordcut from "wordcut-ts";

const wordcut = createWordcut({
  dictPath: ["./customdict/*.txt"],
  withDefaultDict: true,
  additionalWords: ["ชอบกิน", "ข้าวอร่อยมากมาก"]
});

const segmented = wordcut.cutIntoArray("ฉันชอบกินข้าวอร่อยมากมาก");
```

Javascript:

```javascript
const { createWordcut, cut } = require("wordcut-ts");

const wordcut = createWordcut();
const segmented = wordcut.cut("ฉันชอบกินข้าว");
const quick = cut("กากา");
```

Javascript with custom dictionary:

```javascript
const { createWordcut } = require("wordcut-ts");

const wordcut = createWordcut({
  dictPath: ["./customdict/*.txt"],
  withDefaultDict: true,
  additionalWords: ["ชอบกิน", "ข้าวอร่อยมากมาก"]
});

const segmented = wordcut.cutIntoArray("ฉันชอบกินข้าวอร่อยมากมาก");
```

Development
-----------

```bash
npm run build
npm test
```

Project layout:

- `src/` = TypeScript source files
- `lib/` = Generated JavaScript and `.d.ts` files
