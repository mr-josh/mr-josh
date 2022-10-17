import "theme/style.css";

import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Divider, MantineProvider } from "@mantine/core";
import { IconHome, IconPalette } from "@tabler/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ArtPage from "pages/art";
import BioCard from "components/bio-card";
import HomePage from "pages/home";
import { NotificationsProvider } from "@mantine/notifications";

const queryClient = new QueryClient();

const App = () => {
  let path = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withCSSVariables theme={{ colorScheme: "dark" }}>
        <NotificationsProvider>
          <BioCard
            style={{
              height: path.pathname == "/" ? undefined : 0,
            }}
          />
          <section className="page-container" style={{ padding: "2rem" }}>
            <div className="dashboard">
              <nav>
                <Link to="/" className={path.pathname == "/" ? "active" : ""}>
                  <IconHome />
                  <sub>Home</sub>
                </Link>
                <Divider />
                <Link
                  to="/art"
                  className={path.pathname == "/art" ? "active" : ""}
                >
                  <IconPalette />
                  <sub>Art</sub>
                </Link>
              </nav>
              <div className="content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/art" element={<ArtPage />} />
                </Routes>
              </div>
            </div>
          </section>
        </NotificationsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
};

export default App;
