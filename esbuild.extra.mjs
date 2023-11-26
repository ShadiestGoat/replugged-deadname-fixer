export default (c) => {
  // return c
  return {
    ...c,
    loader: {
      ".woff2": "dataurl",
      ".woff": "dataurl",
      ".ttf": "dataurl"
    }
  }
}
