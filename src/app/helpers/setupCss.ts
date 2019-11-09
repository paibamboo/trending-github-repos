import {cssRaw} from "typestyle";
import {FontSize} from "../constants/FontSize";

export function setupCss(): void {
  cssRaw(`
  * {
    box-sizing: border-box;
  }

  html, body {
    font-family: Roboto;
    font-size: ${FontSize.MEDIUM};
    height: auto;
    margin: 0;
  }

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  img {
    image-rendering: -webkit-optimize-contrast;
  }

  a {
    text-decoration: none;
  }

  input, textarea, select, button {
    font-family: Roboto;
    font-size: ${FontSize.MEDIUM};
  }

  ul {
    list-style-type: none;
    padding: 0;
  }
`);
}
