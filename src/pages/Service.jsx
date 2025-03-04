import { useAuth } from "../store/auth";

export const Service = () => {
  const { services } = useAuth();
  return (
    <section className="section-services">
      <div className="container">
        <h1 className="main-heading">Services</h1>
      </div>

      <div className="container grid grid-three-cols">
        {services.map((currEle, index) => {
          return (
            <div className="card" key={index}>
            <div className="card-img">
              <img
                src="/images/design.png"
                alt="our services info"
                width="200"
              />
            </div>
            <div className="card-details">
              <div className="grid grid-two-cols">
                <p>{currEle.provider}</p>
                <p>{currEle.price}</p>
              </div>
              <h2>{currEle.service}</h2>
              <p>{currEle.description}</p>
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
};
