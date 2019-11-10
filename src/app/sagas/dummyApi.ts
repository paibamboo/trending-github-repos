import {Response, SearchReposResponse} from "@octokit/rest";
import {ISearchGithubReposParams} from "../redux/modules/githubReposActionCreators";
import {ITranslations} from "../redux/modules/settingsModule";

// Don't forget to enable this in production!
// tslint:disable:no-http-string

export const dummyApi = {
  getTranslations: (params: string): Promise<ITranslations> => {
    return fetch(`http://localhost:8889/translation/${params}`).then((res) => res.json());
  },
  searchGithubRepos: (params: ISearchGithubReposParams): Promise<Response<SearchReposResponse>> => {
    return fetch(
      `https://api.github.com/search/repositories?` +
        `order=${params.order}` +
        `&page=${params.page}` +
        `&q=${params.q}` +
        `&sort=${params.sort}` +
        `&per_page=${params.perPage}`
    )
      .then(async(res) => {
        const json = await res.json();
        if (res.ok) {
          return {data: json} as any; // todo: being lazy here, need to add all the Response properties
        } else {
          // eslint-disable-next-line no-throw-literal
          throw {message: json.message, status: res.status};
        }
      });
  }
};
