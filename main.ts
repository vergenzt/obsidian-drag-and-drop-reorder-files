import {
  App,
  MarkdownView,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TFile,
} from 'obsidian';

import { LexoNumeralSystem36, LexoRank } from "lexorank";


class NameSafeLexoNumeralSystem36 extends LexoNumeralSystem36 {
  public getRadixPointChar(): string {
    return '⁠-';
  }
}

class NameSafeLexoRank extends LexoRank {
  protected static _NUMERAL_SYSTEM = new NameSafeLexoNumeralSystem36();
  protected static _BUCKET_DECIMAL_SEPARATOR = String.fromCodePoint(0x2060); // unicode word joiner
}


/**
 * Store Lexorank in filename prefixes.
 */
export type FilenameRankStorage = {
  kind: 'FILENAME_PREFIX';

  /**
   * What text should precede the file's rank at beginning of filename.
   * If a filename begins with this prefix, it will be assumed that a Lexorank follows.
   */
  prefix: string;

  /**
   * What text should separate the rank from the rest of the filename.
   */
  separator: string;
}

export type RankStorage = FilenameRankStorage;

export type Settings = {
  rankStorage: RankStorage;
}


const DEFAULT_SETTINGS: Settings = {
  rankStorage: {
    kind: 'FILENAME_PREFIX',
    prefix: '!',
    separator: ' ',
  },
}


class DragAndDropReorderFilesPlugin extends Plugin {
  settings: Settings;

  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
}


