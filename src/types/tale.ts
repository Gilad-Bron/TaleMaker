export interface DialogOption {
  id: string;
  label: string;
}

export interface Dialog {
  id: string;
  text: string;
  options: DialogOption[];
}

export interface Interaction {
  id: string;
  type: "character" | "area";
  name: string;
  dialogs: Dialog[];
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  interactions: Interaction[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  episodes: Episode[];
}

export interface Tale {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
}

export type NodeType = "tale" | "chapter" | "episode" | "interaction" | "dialog";

export interface SelectedNode {
  type: NodeType;
  chapterIndex?: number;
  episodeIndex?: number;
  interactionIndex?: number;
  dialogIndex?: number;
}
