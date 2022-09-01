import "theme/theme.scss";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "pages/home";
import { MantineProvider } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";

const App = () => {
  const scheme = useColorScheme();

  return (
    <MantineProvider
      theme={{
        colorScheme: scheme,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default App;
