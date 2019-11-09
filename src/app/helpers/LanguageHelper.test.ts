import {IFS} from "../../../__mocks__/.fs";

jest.mock("fs");
import {LanguageHelper} from "./LanguageHelper";

const languages: string[] = ["en, en", "en-GB, en;q=0.7", "th"];

describe("LanguageHelper", () => {

  describe("constructor", () => {
    it("accepts settings and we're able to get it", () => {
      const languageHelper = new LanguageHelper(languages[0]);
      expect(languageHelper.getRequestedLanguage()).toBe("en, en");
    });
  });

  describe("getPreferredLanguage()", () => {
    it("returns the most preferred settings", () => {
      const languageHelper = new LanguageHelper(languages[0]);
      expect(languageHelper.getPreferredLanguage()).toBe("en");
    });
  });

  describe("getDefaultLanguage()", () => {
    it("returns en", () => {
      expect(LanguageHelper.getDefaultLanguage()).toBe("en");
    });
  });

  describe("isSupported()", () => {
    it("returns true for en and th", () => {
      expect(LanguageHelper.isSupported("en")).toBeTruthy();
      expect(LanguageHelper.isSupported("th")).toBeTruthy();
      expect(LanguageHelper.isSupported("blah")).toBeFalsy();
    });
  });

  describe("getTranslations()", () => {
    let fs: IFS;

    beforeEach(() => {
      fs = require("fs");
    });

    it("returns settings data object for valid requested settings", () => {
      const languageHelper = new LanguageHelper("th");
      fs.__setFileContents("th.json", JSON.stringify({hello: "สวัสดี"}));
      expect(languageHelper.getTranslations()).toEqual({hello: "สวัสดี"});
    });

    it("returns default settings data object for invalid requested settings", () => {
      fs.__setFileContents("en.json", JSON.stringify({hello: "hello"}));
      const languageHelper = new LanguageHelper("invalid settings");
      expect(languageHelper.getTranslations()).toEqual({hello: "hello"});
    });
  });
});
