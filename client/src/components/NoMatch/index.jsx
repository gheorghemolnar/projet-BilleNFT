import { Link } from "react-router-dom";

export default function NoMatch() {
  return (
    <main>
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h2>It looks like you're lost...</h2>
            <p className="lead text-muted">
              <Link to="/">Go to the home page</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}