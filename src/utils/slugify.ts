/* eslint-disable e18e/prefer-static-regex */
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replaceAll(/[ªÀÁÂÄÅàáâãäå]+/g, "a") // Special Characters #1
    .replaceAll(/[èéêë]+/gi, "e") // Special Characters #2
    .replaceAll(/[ìíîï]+/gi, "i") // Special Characters #3
    .replaceAll(/[ºòóôõö]+/gi, "o") // Special Characters #4
    .replaceAll(/[ùúûü]+/gi, "u") // Special Characters #5
    .replaceAll(/[ýÿ]+/gi, "y") // Special Characters #6
    .replaceAll(/ñ+/gi, "n") // Special Characters #7
    .replaceAll(/ç+/gi, "c") // Special Characters #8
    .replaceAll(/ß+/g, "ss") // Special Characters #9
    .replaceAll(/æ+/gi, "ae") // Special Characters #10
    .replaceAll(/[Øøœ]+/g, "oe") // Special Characters #11
    .replaceAll(/%+/g, "pct") // Special Characters #12
    .replaceAll(/\s+/g, "-") // Replace spaces with -
    .replaceAll(/[^\w-]+/g, "") // Remove all non-word chars
    .replaceAll(/-{2,}/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
