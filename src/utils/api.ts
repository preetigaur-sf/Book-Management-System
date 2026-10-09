import type { Book } from "../types/Book";

export async function loadBooksFromAPI(
  url: string
): Promise<Book[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to load books.json");
  }

  return (await response.json()) as Book[];
}