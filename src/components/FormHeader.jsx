export default function FormHeader({ title, subtitle }) {
  return (
    <>
      <h2 className="text-2xl font-bold  mb-2">{title}</h2>
      <p style={{ color: "#8A8A8A" }} className="mb-8">
        {subtitle}
      </p>
    </>
  );
}
