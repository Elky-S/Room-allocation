import { Routing } from "./routing";
import { BrowserRouter } from "react-router-dom";
import { Nav } from "./nav";

export const Main = () => {
  return (
    <>
      {/* <Provider store={store}> */}
      {/* דפדפן */}
      <BrowserRouter>
        {/* תפריט- יהיה בכל דף */}
        <Nav></Nav>
        {/* טעינת הקומפננטות */}
        <Routing></Routing>
      </BrowserRouter>
      {/* </Provider> */}
    </>
  );
};
