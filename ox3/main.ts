import { render } from "solid-js/web";
import { App } from "./js/app";

const AppElement = document.getElementById("app");

if (AppElement) {
  render(App, document.body);
}
