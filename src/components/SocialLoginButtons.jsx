import google from "../assets/google.png"
import outlook from "../assets/outlook.png"


export default function SocialLoginButtons() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Google */}
      <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
        <img src={google} alt="logo" className="w-5 h-5" />
        <span className="text-sm font-medium text-gray-700">Google</span>
      </button>

      {/* Outlook */}
      <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
        <img src={outlook} alt="logo" className="w-12 h-10" />
        <span className="text-sm font-medium text-gray-700">Outlook</span>
      </button>
    </div>
  );
}
