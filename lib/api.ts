import type { Anime, SingleAnimeResponse } from "./types";

const BASE_API_URL = "https://api.jikan.moe/v4";
const INITIAL_DELAY = 1000;
const MAX_RETRIES = 5;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async <T>(url: string, retry = 0): Promise<T> => {
  try {
    const response = await fetch(url);
    if (response.status === 429 && retry < MAX_RETRIES) {
      const backOff = INITIAL_DELAY * Math.pow(retry, 2);
      await delay(backOff);
      return fetchWithRetry<T>(url, retry + 1);
    }
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};

export const fetchAnime = async <T>(
  endpoint: string,
  params: Record<string, string | number | undefined> = {}
): Promise<T> => {
  const queryParams = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");
  const url = `${BASE_API_URL}${endpoint}${
    queryParams ? `?${queryParams}` : ""
  }`;
  return fetchWithRetry<T>(url);
};

export const getAnimeById = async (
  id: number
): Promise<SingleAnimeResponse> => {
  return fetchAnime<SingleAnimeResponse>(`/anime/${id}`);
};

export const getRandomAnime = async (): Promise<Anime> => {
  const response = await fetchAnime<SingleAnimeResponse>(`/random/anime`);
  return response.data;
};

export const getComments = async (animeId: number) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/comments/${animeId}`);
  const data = await response.json();
  if (data?.comments) {
    return data?.comments;
  } else {
    console.error("Error fetching comments:", data);
  }
};
