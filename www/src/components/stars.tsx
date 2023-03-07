import "./stars.css";

const Stars = () => {
  return (
    <>
      {[...Array(30)].map((_, i) => {
        return (
          <p
            key={i}
            className={`star v-${(i % 4) + 1}`}
            style={{
              position: "absolute",
              left: `${Math.floor(Math.random() * 100)}%`,
              top: `${Math.floor(Math.random() * 100)}%`,
            }}
          >
            *
          </p>
        );
      })}
    </>
  );
};

export default Stars;
