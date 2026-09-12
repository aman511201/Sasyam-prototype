import { ArrowLeft, Home, Sprout } from "lucide-react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white text-center">
      <div className="max-w-md space-y-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-400 mx-auto border border-emerald-500/20">
          <Sprout size={40} />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest">404 Error</p>
          <h1 className="text-3xl font-black">Field Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The page or agricultural plot you are searching for does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/app/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shadow-md shadow-emerald-950"
          >
            <Home size={15} />
            Back to Dashboard
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
          >
            <ArrowLeft size={15} />
            Sign In Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;