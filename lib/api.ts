import { Anime, AnimeResponse } from "./types";
const BASE_API_URL = "https://api.jikan.moe/v4";
const INITIAL_DELAY = 1000;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const MAX_RETRIES = 5;
const fetchWithRetry = async (
  url: string,
  retry = 0
): Promise<AnimeResponse> => {
  try {
    const response = await fetch(url);
    if (response.status == 429) {
      if (retry < MAX_RETRIES) {
        const backOff = INITIAL_DELAY * Math.pow(retry, 2);
        await delay(backOff);
        return fetchWithRetry(url, retry + 1);
      }
    }
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchAnime = async (
  endpoint: string,
  params: Record<string, string | number | undefined> = {}
) => {
  const queryParams = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");
  const url = `${BASE_API_URL}${endpoint}${
    queryParams ? `?${queryParams}` : ""
  }`;

  console.log(url);

  try {
    return await fetchWithRetry(url);
  } catch (error) {
    console.error("Error fetching anime data:", error);
    throw error;
  }
};

export const getRandomAnime = async (): Promise<Anime> => {
  const response = await fetchAnime(`/random/anime`);
  return response.data;
};


export const getAnimeById = async (id: number) => {
  return fetchAnime(`/anime/${id}`);
};
