import { List } from "../utils/types";

interface LocalStorageLists {
  [x: string]: ListPartial;
}
export type ListPartial = Pick<List, "id" | "title" | "description">;
const LIST_LOCALSTORAGE_KEY = "lists";
export const getListObjectFromLocalStorage = (): LocalStorageLists => {
  let listsFromLocalStorage = localStorage.getItem(LIST_LOCALSTORAGE_KEY);
  if (!listsFromLocalStorage) {
    return {};
  }
  try {
    listsFromLocalStorage = JSON.parse(listsFromLocalStorage);
    if (listsFromLocalStorage && typeof listsFromLocalStorage === "object") {
      return listsFromLocalStorage;
    }
  } catch (error) {
    console.warn("Unable to read lists from localStorage");
  }
  return {};
};

export const setListInLocalStorage = ({
  id,
  title,
  description,
}: ListPartial) => {
  const currentLists = getListObjectFromLocalStorage();
  currentLists[id] = { id, title, description };
  localStorage.setItem(LIST_LOCALSTORAGE_KEY, JSON.stringify(currentLists));
};

export const getListTitlesFromLocalStorage = () => {
  const lists = getListObjectFromLocalStorage();
  return Object.entries(lists).map(([, v]) => {
    return { title: v.title, id: v.id };
  });
};
