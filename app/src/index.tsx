import "theme/reset.css";
import "theme/style.css";
import "theme/material-symbols.css";

import { Auth } from "auth/instance";
import Router from "./pages/router";
/* @refresh reload */
import { render } from "solid-js/web";

Auth.handleRedirectPromise();
render(() => <Router />, document.getElementById("root") as HTMLElement);
