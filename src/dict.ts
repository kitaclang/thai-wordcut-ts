import fs from "fs";
import path from "path";
import { globSync } from "glob";
import { createPrefixTree } from "./prefixtree";
import type { Acceptor } from "./acceptors";

type DictAcceptor = Acceptor & {
  nodeId: number;
  dict: typeof WordcutDict;
};

const WordcutDict = {
  dict: [] as string[],
  tree: createPrefixTree<string | null>([]),

  init(dictPathFile?: string | string[], withDefault?: boolean, words?: string[]) {
    withDefault = withDefault || false;
    const defaultDict = path.normalize(`${__dirname}/..`) + "/data/tdict-*.txt";

    this.dict = [];
    const dictPathIsDefined = dictPathFile !== undefined;
    const dictPath = withDefault || !dictPathIsDefined ? [defaultDict] : [];
    const nextDictPathFile = dictPathFile || defaultDict;

    if (dictPathIsDefined) {
      if (Array.isArray(nextDictPathFile)) {
        dictPath.push(...nextDictPathFile);
      } else {
        dictPath.push(nextDictPathFile);
      }
    }

    this.addFiles(dictPath, false);

    if (words !== undefined) {
      this.addWords(words, false);
    }

    this.finalizeDict();
  },

  addWords(words: string[], finalize?: boolean) {
    finalize = finalize === undefined || finalize;
    this.dict.push(...words);
    if (finalize) {
      this.finalizeDict();
    }
  },

  finalizeDict() {
    this.dict = this.sortuniq(this.dict);
    this.tree = createPrefixTree(this.dict.map((w) => [w, null] as [string, null]));
  },

  addFiles(files: string[], finalize?: boolean) {
    finalize = finalize === undefined || finalize;
    const resolvedFiles = this.sortuniq(this.flatten(files.map((x) => globSync(x))));

    for (const file of resolvedFiles) {
      const words = fs
        .readFileSync(file, { encoding: "utf-8" })
        .split(/[\r\n]+/)
        .filter((w) => w.length > 1);

      this.addWords(words, false);
    }

    if (finalize) {
      this.finalizeDict();
    }
  },

  createAcceptor(): DictAcceptor {
    const dict = this;
    return {
      nodeId: 0,
      strOffset: 0,
      isFinal: false,
      isError: false,
      tag: "DICT",
      w: 1,
      type: "DICT",
      dict,
      transit(ch: string) {
        return this.dict.transit(this, ch);
      }
    };
  },

  transit(acceptor: DictAcceptor, ch: string): DictAcceptor {
    const child = this.tree.lookup(acceptor.nodeId, acceptor.strOffset, ch);

    if (child !== null) {
      const [nodeId, isFinal] = child;
      acceptor.nodeId = nodeId;
      acceptor.strOffset++;
      acceptor.isFinal = isFinal;
    } else {
      acceptor.isError = true;
    }

    return acceptor;
  },

  sortuniq(a: string[]) {
    return a.sort().filter((item, pos, arr) => !pos || item !== arr[pos - 1]);
  },

  flatten<T>(a: T[][]): T[] {
    return ([] as T[]).concat(...a);
  }
};

export = WordcutDict;
