import logo from "../assets/logo.svg";
export default function LogoHeader({ title }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      <div >
        <img src={logo} alt="logo" />
      </div>
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
}
