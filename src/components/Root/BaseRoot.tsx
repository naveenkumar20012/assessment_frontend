import { Toaster } from "react-hot-toast";

import Global from "../Global/Global";
import Meta from "../Meta/Meta";

const BaseRoot = () => {
  return (
    <>
      <Meta />
      <Toaster />
      <Global />
    </>
  );
};

export default BaseRoot;
