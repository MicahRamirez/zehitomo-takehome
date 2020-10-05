import { NextApiRequest, NextApiResponse } from "next";
import Unsplash, { toJson } from "unsplash-js";

import searchMock from "../../utils/searchMock.json";
import { Photo, RawPhoto, RawSearch } from "../../utils/types";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY
  ? process.env.UNSPLASH_ACCESS_KEY
  : "";

const UNSPLASH_IS_MOCK = process.env.UNSPLASH_IS_MOCK === "true" ? true : false;
console.log(UNSPLASH_IS_MOCK);

/**
 * Maps properties from unsplash API /search to a structure that more simply fullfills frontend requirements
 *
 * @param rawSearchResults results from unsplash API
 * @returns {Photo[]} A simplified version of the photo data model specific to frontend requirements
 */
const transformSearchResultsToPhotoList = (
  rawSearchResults: RawSearch
): Photo[] => {
  return rawSearchResults.results.map<Photo>((raw: RawPhoto) => {
    return {
      id: raw.id,
      photoUrls: raw.urls,
      associatedUserImageURL: raw.user.profile_image.small,
      associatedUserProfileURL: raw.user.links.html,
      associatedUsername: raw.user.username,
      downloadURL: raw.links.download,
    };
  });
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  // requests are limited to 50 per hour, need a way to work with the data without killing my budget;
  if (req.method === "GET" && UNSPLASH_IS_MOCK) {
    console.log("mocking");
    console.log(req.query);
    return res
      .status(200)
      .json({ data: transformSearchResultsToPhotoList(searchMock.data) });
  } else if (req.method === "POST") {
    const unsplash = new Unsplash({ accessKey: UNSPLASH_ACCESS_KEY });
    unsplash.search
      .photos(req.body.searchString, 1, 10, {
        orientation: "squarish" as any,
      })
      .then(toJson)
      .then((json) => {
        console.log("result", json);
        return res
          .status(200)
          .json({ data: transformSearchResultsToPhotoList(json.data) });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ error: true });
      });
  } else {
    res.status(405).send("not supported");
  }
};

export default handler;
