export default function convertNewlinesToBr(text: string) {
  if (typeof text !== "string") {
    return text;
  }
  return text.replace(/\n/g, "<br>");
}
