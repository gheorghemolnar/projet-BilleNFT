import { Link } from "react-router-dom";

export default function NoMatch() {
  return (
    <main>
      <section class="py-5 text-center container">
        <div class="row py-lg-5">
          <div class="col-lg-6 col-md-8 mx-auto">
            <h2>It looks like you're lost...</h2>
            <p class="lead text-muted">
              <Link to="/">Go to the home page</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}