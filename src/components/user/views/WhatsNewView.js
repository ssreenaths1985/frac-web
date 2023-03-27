import React from "react";

class WhatsNewView extends React.Component {
  render() {
    return (
      <div className="col-12" id="listView">
        <section>
          <center>
            <div className="mt-5">
              <h3>FRACing toolkit walkthrough</h3>
              <h6 className="pt-1">Last updated on 02/03/2021 as per v9</h6>
              <div className="mt-5">
                <video
                  id="videoElement"
                  controls="true"
                  poster="/videos/poster.png"
                  src="/videos/v9_walkthrough.mp4"
                  type="video/mp4"
                  width="50%"
                  height="50%"
                ></video>
              </div>
            </div>
          </center>
        </section>

        <section>
          <center>
            <div className="mt-5 mb-5">
              <h3>What's new</h3>
              <h6 className="pt-1">Last updated on 10/12/2020 as per v8</h6>
              <div className="mt-5">
                <video
                  id="videoElement"
                  controls="true"
                  poster="/videos/poster_new.png"
                  src="/videos/v8.mp4"
                  type="video/mp4"
                  width="50%"
                  height="50%"
                ></video>
              </div>
            </div>
          </center>
        </section>
      </div>
    );
  }
}

export default WhatsNewView;
