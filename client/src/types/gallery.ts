export interface GalleryImage {
  src: string;
  alt: string;
}

export interface CurrentImages {
  prev: GalleryImage | null;
  center: GalleryImage;
  next: GalleryImage | null;
}

export interface Category {
  id: string;
  name: string;
  items: string[];
}