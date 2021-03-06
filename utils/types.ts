export interface Photo {
  id: string;
  photoUrls: PhotoUrls; // different sizes and types for the image
  associatedUserImageURL: string; // small thumbnail for user
  associatedUserProfileURL: string;
  downloadURL: string; // preferred link to download
  associatedUsername: string;
}

export interface PhotoUrls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
}
export interface PhotoLinks {
  self: string;
  html: string;
  download: string;
  download_location: string;
}

export interface RawUser {
  username: string;
  links: {
    html: string;
  };
  profile_image: {
    small: string;
  };
}

export interface RawPhoto {
  id: string;
  urls: PhotoUrls;
  links: PhotoLinks;
  user: RawUser;
}

export interface RawSearch {
  total: number;
  total_pages: number;
  results: RawPhoto[];
}

type PhotoSubset = Pick<Photo, "id" | "photoUrls">;
export interface ListPUTBody {
  title: string;
  description: string;
  photos: PhotoSubset[];
}

export interface ListPOSTBody {
  listIds: string[];
}

export interface ListPATCHBody {
  title?: List["title"];
  description?: List["description"];
  photos?: List["photos"];
}

export interface List {
  id: string;
  title: string;
  description: string;
  photos: PhotoSubset[];
}
