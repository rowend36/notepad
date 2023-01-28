const Image = ({ src, srcDark, ...props }) => {
  return (
    <picture>
      {srcDark ? (
        <source
          srcset={srcDark}
          media="(prefers-color-scheme:dark)"
          {...props}
        />
      ) : undefined}
      <img
        src={src}
        {...props}
        style={{
          display: "inherit",
          lineHeight: "inherit",
        }}
      />
    </picture>
  );
};
export default Image;
