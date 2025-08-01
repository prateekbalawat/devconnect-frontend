import { Link } from "react-router-dom";
import heroImg from "../assets/devconnect-hero.png"; // Add your own image here

const LandingPage = () => {
  return (
    <div className="bg-white text-gray-900">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Left content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Connect. Code. Grow.
          </h1>
          <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-md mx-auto md:mx-0">
            DevConnect helps you share your journey, follow fellow developers,
            and grow together in the coding world.
          </p>
          <Link to="/signup">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300">
              Get Started
            </button>
          </Link>
        </div>

        {/* Right image */}
        <div className="md:w-1/2">
          <img
            src={heroImg}
            alt="Developers collaborating"
            className="w-full max-w-sm md:max-w-full mx-auto"
          />
        </div>
      </section>
      <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8">Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                title: "Personalized Developer Profiles",
                text: "Showcase your posts, projects, and presence on a custom profile page.",
              },
              {
                title: "Interactive Global & Following Feed",
                text: "Engage with the community through posts, likes, comments, and follows.",
              },
              {
                title: "Real-Time Commenting System",
                text: "Start conversations with threaded comments and reply support.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
              >
                <p className=" font-semibold p-2 text-gray-900">
                  {feature.title}
                </p>
                <p className=" text-gray-900">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
