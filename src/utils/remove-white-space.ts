export function removeWhiteSpace(text: string): string {
  // Use a regular expression to replace all white spaces with an empty string
  return text.replace(/\s/g, '');
}
