import mongoose, { Schema, Document } from "mongoose";
export interface Jpg {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface Webp {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface Images {
  jpg: Jpg;
  webp: Webp;
}

export interface TrailerImages {
  image_url: string | null;
  small_image_url: string | null;
  medium_image_url: string | null;
  large_image_url: string | null;
  maximum_image_url: string | null;
}

export interface Trailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
  images: TrailerImages;
}

export interface Aired {
  from: string | null;
  to: string | null;
  string: string;
}

export interface Studio {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Genre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Anime {
  mal_id: number;
  url: string;
  images: Images;
  trailer: Trailer;
  approved: boolean;
  title: string;
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: Aired;
  duration: string | null;
  rating: string | null;
  score: number | null;
  rank: number | null;
  popularity: number | null;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  studios: Studio[];
  genres: Genre[];
  explicit_genres: Genre[];
}

export interface AnimeResponse {
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
  data: Anime[];
}

export interface SearchParams {
  q?: string;
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  genres?: string;
  sort?: string;
  order_by?: string;
  sfw?: boolean;
}

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  image: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  googleId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
});

export const User =
  mongoose.models.User || mongoose.model<IUser>("AniVerse user", UserSchema);
