import Link from "next/link";

type Props = { msg: string };
export const PageNotFound = ({ msg }: Props) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-12">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-700">{msg ?? "Page Not Found"}</h2>
      <p className="mt-2 text-center text-gray-500"></p>

      <Link
        href="/"
        className="mt-6 rounded-2xl bg-blue-600 px-6 py-2 text-white shadow-md transition hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
};
