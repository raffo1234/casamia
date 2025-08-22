export function getKeyFromUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname.substring(1);
  } catch (error) {
    console.error(
      "Error parsing URL or extracting key in getKeyFromUrl:",
      error
    );
    return null;
  }
}
