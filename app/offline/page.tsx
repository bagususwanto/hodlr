"use client";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-4 text-3xl font-bold">You are offline</h1>
      <p className="mb-8 text-lg text-gray-600">
        Please check your internet connection and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800">
        Retry
      </button>
    </div>
  );
}
