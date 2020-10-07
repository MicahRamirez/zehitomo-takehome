import { NextApiRequest, NextApiResponse } from "next";
import Unsplash, { toJson } from "unsplash-js";

import searchMock from "../../utils/searchMock.json";
import { Photo, RawPhoto, RawSearch } from "../../utils/types";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY
  ? process.env.UNSPLASH_ACCESS_KEY
  : "";

const UNSPLASH_IS_MOCK = process.env.UNSPLASH_IS_MOCK === "true" ? true : false;

// Maps properties from unsplash API /search to a structure that more simply fullfills frontend requirements
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
  // requests are limited to 50 per hour, need a way to work with the data without killing the budget
  if (req.method === "GET" && UNSPLASH_IS_MOCK) {
    return res
      .status(200)
      .json({ data: transformSearchResultsToPhotoList(searchMock.data) });
  } else if (req.method === "GET") {
    const unsplash = new Unsplash({ accessKey: UNSPLASH_ACCESS_KEY });
    let { keyword, page } = req.query;
    let pageNumber;
    if (!page) {
      pageNumber = 1;
    } else if (typeof page === "string") {
      pageNumber = parseInt(page);
    }
    if (!Array.isArray(keyword)) {
      return unsplash.search
        .photos(keyword, pageNumber, 30, {
          orientation: "squarish" as any,
        })
        .then(toJson)
        .then((json) => {
          return res.status(200).json({
            data: transformSearchResultsToPhotoList(json),
            total: json.total,
            totalPages: json.total_pages,
          });
        })
        .catch((err) => {
          console.error("there was an error calling unsplash", err);
          return res.status(400).json({ error: true });
        });
    }
  } else {
    res.status(405).send("not supported");
  }
};

export default handler;
