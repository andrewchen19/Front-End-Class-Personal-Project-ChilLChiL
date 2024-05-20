import notFound from "../assets/images/not-found.svg";
import { NavLink, useRouteError, isRouteErrorResponse } from "react-router-dom";

// shadcn
import { Button } from "@/components/ui/button";

const Error: React.FC = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <main className="flex min-h-screen items-center justify-center">
          <section className="gay-y-8 grid items-center justify-center gap-x-16 lg:grid-cols-2">
            {/* image */}
            <div className="max-w-[500px]">
              <img src={notFound} alt="not found" className="w-full" />
            </div>
            {/* info */}
            <div className="text-center">
              <h1 className="text-3xl font-bold capitalize lg:text-4xl">
                page not found
              </h1>
              <p className="mb-4 mt-4 leading-7 tracking-wide">
                Sorry, we couldn't find the page you're looking for
              </p>
              <NavLink to="/">
                <Button size={"lg"} variant={"turquoise-hipster"}>
                  Home
                </Button>
              </NavLink>
            </div>
          </section>
        </main>
      );
    }
  }
};

export default Error;
