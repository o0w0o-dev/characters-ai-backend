async function fetchUrlAsBase64String(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");
    return base64String;
  } catch (error) {
    throw new Error(`Error fetching file url: ${error.message}`);
  }
}

export { fetchUrlAsBase64String };
