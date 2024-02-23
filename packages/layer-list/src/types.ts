import { type Source } from '@cesdk/cesdk-js';

export type BGRemovalIdle = { status: 'IDLE' };
export type BGRemovalPending = { status: 'PENDING' };

export type BGRemovalProcessing = {
  version: string;
  status: 'PROCESSING';

  initialImageFileURI: string;
  initialSourceSet: Source[];

  blockId: number;
  fillId: number;

  progress?: {
    key: string;
    current: number;
    total: number;
  };
};

export type BGRemovalProcessed = {
  version: string;
  status: 'PROCESSED_WITH_BG' | 'PROCESSED_WITHOUT_BG';

  initialImageFileURI: string;
  initialSourceSet: Source[];

  blockId: number;
  fillId: number;

  removedBackground: string | Source[];
};

export type BGRemovalError = {
  version: string;
  status: 'ERROR';

  initialImageFileURI: string;
  initialSourceSet: Source[];

  blockId: number;
  fillId: number;
};

export type BGRemovalMetadata =
  | BGRemovalIdle
  | BGRemovalError
  | BGRemovalPending
  | BGRemovalProcessing
  | BGRemovalProcessed;
