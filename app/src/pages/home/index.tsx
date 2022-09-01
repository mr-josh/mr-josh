import { Center, Title } from "@mantine/core";
import { Route, Routes } from "react-router-dom";

import BaseContent from "./content/base";
import style from "./style.module.scss";

const HomePage = () => {
  return (
    <Center style={{ width: "100%", height: "100%" }}>
      <div className={style.card}>
        <div className={style.header}>
          <Title>Mr Josh</Title>
          <img
            className={style.pp}
            src="https://avatars.githubusercontent.com/u/18021383?v=4"
          />
        </div>
        <hr />
        <div className={style.content}>
          <Routes>
            <Route path="/" element={<BaseContent />} />
          </Routes>
        </div>
      </div>
    </Center>
  );
};

export default HomePage;
