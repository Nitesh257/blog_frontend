import { NavLink } from "react-router-dom";
import { Analytics } from "../components/Analytics";
import { useAuth } from "../store/auth";
import { FaLinkedin } from "react-icons/fa";
import { BsGithub } from "react-icons/bs";
import { PiProjectorScreenChart } from "react-icons/pi";
export const About = () => {
  const { user } = useAuth();
  return (
    <>
      <main>
        <section className="section-hero">
          <div className="container grid grid-two-cols">
            <div className="hero-content">
              <p>
                Welcome{" "}
                {user
                  ? `${user.username} to our website`
                  : `to our website Login to see your username here`}
              </p>
              <h1></h1>
              <p>
              </p>
              <div style={{display:"flex" , alignItems:"left"}}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <a
                  href="https://www.linkedin.com/in/nitesh0078/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <FaLinkedin style={{ fontSize: "50px" }} />
                </a>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "500",
                  }}
                >
                  Connect on LinkedIn
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px", margin:"30px" }}
              >
                <a
                  href="https://github.com/Nitesh3423"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <BsGithub style={{ fontSize: "50px" ,color:"grey" }} />
                </a>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "500",
                  }}
                >
                  Github
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px", margin:"30px" }}
              >
                <a
                  href="https://portfolio-theta-one-61.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <PiProjectorScreenChart style={{ fontSize: "50px" ,color:"grey" }} />
                </a>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "500",
                  }}
                >
                  Portfolio
                </div>
              </div>
              </div>

             
              <div className="btn btn-group">
                <NavLink to="/contact">
                  <button className="btn"> Connect Now</button>
                </NavLink>
                <button className="btn secondary-btn">learn more</button>
              </div>
            </div>
            <div className="hero-image">
              <img
                src="/images/about.png"
                alt="coding buddies "
                width="400"
                height="500"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
