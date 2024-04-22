export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replaceAll(/[ªÀÁÂÄÅàáâãäå]+/g, "a") // Special Characters #1
    .replaceAll(/[ÈÉÊËèéêë]+/g, "e") // Special Characters #2
    .replaceAll(/[ÌÍÎÏìíîï]+/g, "i") // Special Characters #3
    .replaceAll(/[ºÒÓÔÕÖòóôõö]+/g, "o") // Special Characters #4
    .replaceAll(/[ÙÚÛÜùúûü]+/g, "u") // Special Characters #5
    .replaceAll(/[ÝýÿŸ]+/g, "y") // Special Characters #6
    .replaceAll(/[Ññ]+/g, "n") // Special Characters #7
    .replaceAll(/[Çç]+/g, "c") // Special Characters #8
    .replaceAll(/ß+/g, "ss") // Special Characters #9
    .replaceAll(/[Ææ]+/g, "ae") // Special Characters #10
    .replaceAll(/[Øøœ]+/g, "oe") // Special Characters #11
    .replaceAll(/%+/g, "pct") // Special Characters #12
    .replaceAll(/\s+/g, "-") // Replace spaces with -
    .replaceAll(/[^\w-]+/g, "") // Remove all non-word chars
    .replaceAll(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
