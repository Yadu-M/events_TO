import { Link,  } from "react-router";
import { Button } from "./Components/ui/button";

export const Error = () => {
  return (
    <div className="flex flex-col p-10 gap-5">
      <h1>400 Bad Requesy</h1>
      <Link to="/" className="w-fit">
        <Button>Take me back</Button>        
      </Link>
    </div>
  );
};
