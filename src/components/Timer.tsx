import { signal } from "@preact/signals-react";
import server from "../server";
import { useEffect } from "react";

const FS = screen.height > screen.width ? "vw" : "vh";

function Timer() {
  const hhmmss = signal(new Date(getTimeDiffMls()).toISOString().slice(11, 19));
  useEffect(() => {
    setInterval(() => {
      hhmmss.value = new Date(getTimeDiffMls()).toISOString().slice(11, 19);
    }, 1000);
  });
  function getTimeDiffMls() {
    if (server?.time?.value.start instanceof Date) {
      return new Date().getTime() - server?.time?.value?.start.getTime();
    }
    return 0;
  }
  return (
    <>
      <div
        style={{
          fontSize: `6${FS}`,
          padding: `2${FS}`,
          margin: `2${FS}`,
        }}
        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
      >
        {hhmmss}
      </div>
    </>
  );
}

export default Timer;
