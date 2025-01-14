import React, { useState } from "react";
import classNames from "classnames";
import { SectionProps } from "../../utils/SectionProps";
import ButtonGroup from "../elements/ButtonGroup";
import Button from "../elements/Button";
import Image from "../elements/Image";
import Modal from "../elements/Modal";

import banner_slider from "./../../assets/images/banner_slider.png";
import SignUpForm from "../elements/SignUpForm";

const propTypes = {
  ...SectionProps.types,
};

const defaultProps = {
  ...SectionProps.defaults,
};

const Hero = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  ...props
}) => {
  const [videoModalActive, setVideomodalactive] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);

  const openModal = (e) => {
    // e.preventDefault();
    // setVideomodalactive(true);
    setShowSignUpForm(true);
  };

  const closeModal = (e) => {
    // e.preventDefault();
    // setVideomodalactive(false);
    setShowSignUpForm(false);
  };

  const outerClasses = classNames(
    "hero section center-content",
    topOuterDivider && "has-top-divider",
    bottomOuterDivider && "has-bottom-divider",
    hasBgColor && "has-bg-color",
    invertColor && "invert-color",
    className
  );

  const innerClasses = classNames(
    "hero-inner section-inner",
    topDivider && "has-top-divider",
    bottomDivider && "has-bottom-divider"
  );

  return (
    <section {...props} className={outerClasses}>
      <SignUpForm closeModal={closeModal} open={showSignUpForm}></SignUpForm>
      <div className="container-sm">
        <div className={innerClasses}>
          <div className="hero-content">
            <h1
              className="mt-0 mb-16 reveal-from-bottom"
              data-reveal-delay="200"
            >
              STUDENT INFORMATIC{" "}
              <span className="text-color-warning">CLUB</span>
            </h1>
            <div className="container-xs">
              <p
                className="m-0 mb-32 reveal-from-bottom"
                data-reveal-delay="400"
              >
                ''Sinh viên giúp sinh viên làm chủ công nghệ.''
              </p>
              <div className="reveal-from-bottom" data-reveal-delay="600">
                <ButtonGroup>
                  <span onClick={openModal}>
                    <Button color="primary" wideMobile className="hover-btn">
                      Đăng kí CTV
                    </Button>
                  </span>
                </ButtonGroup>
              </div>
            </div>
          </div>
          <div
            className="hero-figure reveal-from-bottom illustration-element-01"
            data-reveal-value="20px"
            data-reveal-delay="800"
          >
            <a
              data-video="https://youfiles.herokuapp.com/418514c8-cb09-46a8-ae1e-fda564e8704c"
              href="#0"
              aria-controls="video-modal"
              onClick={openModal}
            >
              <Image
                className="has-shadow"
                src={banner_slider}
                alt="Hero"
                width={896}
                height={504}
              />
            </a>
          </div>
          <Modal
            id="video-modal"
            show={videoModalActive}
            handleClose={closeModal}
            video="https://youfiles.herokuapp.com/418514c8-cb09-46a8-ae1e-fda564e8704c"
            videoTag="iframe"
          />
        </div>
      </div>
    </section>
  );
};

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;
