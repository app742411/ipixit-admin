import GridShape from "../../components/common/GridShape";
import { Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import Lottie from "lottie-react";
import PageNotFoundAnimation from "../../lottie/PageNotFound.json";

export default function NotFound() {
  return (
    <>
      <PageMeta
        title="404 Not Found | ipixit Admin Dashboard"
      />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1 bg-white dark:bg-gray-900">
        <GridShape />
        <div className="mx-auto w-full max-w-[600px] text-center flex flex-col items-center justify-center z-10">

          <div className="w-full max-w-[300px] sm:max-w-[450px]">
            <Lottie animationData={PageNotFoundAnimation} loop={true} />
          </div>

          <h1 className="mt-6 mb-2 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
            Page Not Found
          </h1>

          <p className="mb-8 text-base text-gray-600 dark:text-gray-400 sm:text-lg">
            We can’t seem to find the page you are looking for! It might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-7 py-3.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition-colors dark:bg-brand-500 dark:hover:bg-brand-600"
          >
            Back to Home Page
          </Link>
        </div>
        {/* <!-- Footer --> */}
        <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
          &copy; {new Date().getFullYear()} - ipixit Admin
        </p>
      </div>
    </>
  );
}
