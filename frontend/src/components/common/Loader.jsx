export default function Loader({ label = "Loading..." }) {
  return (
    <div className="loader-wrap" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>{label}</span>
    </div>
  );
}
