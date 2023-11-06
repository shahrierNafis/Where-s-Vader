const targetHeight =
  window.innerWidth < window.innerHeight
    ? window.innerWidth * 0.15
    : window.innerHeight * 0.15;
function Target({
  target,
}: {
  target: { _id: string; name: string; img: string };
}) {
  return (
    <>
      <div
        style={{
          position: "relative",
          height: targetHeight,
          display: "flex",
          alignItems: "center",
          border: "1px solid black",
          fontSize: targetHeight / 1.5,
        }}
      >
        <img src={target.img} alt={target.name} className="h-100" />
        <span>{target.name}</span>
      </div>
    </>
  );
}

export default Target;