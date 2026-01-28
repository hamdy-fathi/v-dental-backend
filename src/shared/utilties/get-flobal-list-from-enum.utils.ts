import {
  ArticleType,
  CategoryType,
  MediaType,
  Role
} from "../enum/global-enum";

export function getRoleList() {
  return generateListFromEnum(Role);
}

export function getMediaTypeList() {
  return generateListFromEnum(MediaType);
}

export function getArticleTypeList() {
  return generateListFromEnum(ArticleType);
}

export function getCategoryTypeList() {
  return generateListFromEnum(CategoryType);
}


export function generateListFromEnum<T extends Record<string, any>>(enumObj: T) {
  return Object.entries(enumObj).map(([key, value]) => ({
    label: key
      .split("_")
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" "),
    value,
  }));
}
