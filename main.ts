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


const UNICODE_WORD_JOINER = String.fromCodePoint(0x2060);

class NameSafeLexoNumeralSystem36 extends LexoNumeralSystem36 {
  public getRadixPointChar(): string {
    return UNICODE_WORD_JOINER;
  }
}

class NameSafeLexoRank extends LexoRank {
  protected static _NUMERAL_SYSTEM = new NameSafeLexoNumeralSystem36();
  protected static _BUCKET_DECIMAL_SEPARATOR = UNICODE_WORD_JOINER
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


export default class DragAndDropReorderFilesPlugin extends Plugin {
  settings: Settings;

  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

    this.app.workspace.on('file-menu', (menu, file) => {
      menu.addItem(item => item
        .setTitle('Add LexoRank')
        .onClick(async () => {
          const { prefix, separator } = this.settings.rankStorage;
          const rank = NameSafeLexoRank.middle();
          const newFilename = [prefix, rank, separator, file.name].join('');
          await this.app.fileManager.renameFile(file, newFilename);
        })
      );
    });
  }
}


