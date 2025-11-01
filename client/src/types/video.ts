export interface HTMLVideoElementWithControls extends HTMLVideoElement {
  play(): Promise<void>;
  pause(): void;
  currentTime: number;
}

export interface VideoTarget extends EventTarget {
  play(): Promise<void>;
  pause(): void;
  currentTime: number;
}