import * as d3 from "d3";

export interface ApiNode {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  pageRank: number;
}

export interface ApiLink {
  source: string;
  target: string;
}

export type ApiSimNode = ApiNode & d3.SimulationNodeDatum & { degree?: number; rankNorm: number };

export type ApiSimLink = d3.SimulationLinkDatum<ApiSimNode>;

export interface UserGraphPanelProps {
  node: ApiNode;
  allNodes: ApiNode[];
  links: ApiLink[];
  onClose: () => void;
  onSelect: (node: ApiNode) => void;
  onConnectionHover: (node: ApiNode | null) => void;
}

