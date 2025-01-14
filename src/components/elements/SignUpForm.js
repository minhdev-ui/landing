import classNames from "classnames";
import { Field, Form, Formik } from "formik";
import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

import * as Yup from "yup";
import CountDown from "../../utils/CountDown";
import { SectionProps } from "../../utils/SectionProps";
import {
  basicQues,
  chooseOption,
  chooseQues,
  infoContact,
  textMainBase,
} from "../sections/signUpForm/signUpFormQues";
import "./../../assets/css/style.css";
import createNotification from "./Nofication";
import emailjs from "@emailjs/browser";
import axios from "axios";
import config from "../../db.config";
import DateTime from "./Date";
import toast from "react-hot-toast";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
const propTypes = {
  ...SectionProps.types,
  status: PropTypes.bool,
};

const defaultProps = {
  ...SectionProps.defaults,
  status: false,
};

const SignUpForm = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  status,
  open,
  closeModal,
  ...props
}) => {
  // Định dạng mẫu: 2022-12-24T00:00:00
  const dayOut =
    textMainBase.yearEnd +
    "-" +
    textMainBase.monthEnd +
    "-" +
    textMainBase.dayEnd +
    `T${textMainBase.hourEnd}:${textMainBase.miniteEnd}:${textMainBase.secondEnd}`;
  const dateData = CountDown(dayOut);
  const innerClasses = classNames("signUpForm-inner");
  const [disabled, setDisabled] = useState(false);

  useMemo(() => setDisabled(dateData.isTimeOut), [dateData.isTimeOut]);

  const handleSubmit = async (obj) => {
    toast.promise(
      axios
        .post(`${config.API_URL}/api/ctv/add`, obj)
        .then((res) => {
          if (res.status === 200) {
            createNotification("success", {
              message: "Cảm ơn bạn đã đăng ký CTV :3",
              duration: 2,
              placement: "bottomRight",
            });
          } else {
            createNotification("error", {
              message: "Lỗi Mạng",
              duration: 2,
              placement: "bottomRight",
            });
          }
        })
        .catch((err) => {
          createNotification("error", {
            message: "Lỗi Đăng Ký!",
            duration: 2,
            placement: "bottomRight",
          });
          console.log(err);
        }),
      {
        loading: "Đang Xử Lý...",
        success: "Xử Lý Thành Công",
        error: "Lỗi Trong Quá Trình Xử Lý",
      }
    );
  };

  const handleSignUp = async (values) => {
    axios.get(`${config.API_URL}/api/ctv`).then((res) => {
      if (
        res.data.find((item) => item.email.toString() === values.email) !==
        undefined
      ) {
        createNotification("error", {
          message: "Email này đã được đăng ký!",
          duration: 2,
          placement: "bottomRight",
        });
      } else {
        handleSubmit(values).then(() => sendEmail(values));
      }
    });
  };

  const sendEmail = (values) => {
    emailjs.send("gmail", "template_ol8vwc6", values, "iaJ4LMteT5H4R1l9d").then(
      (result) => {
        console.log(result.text);
      },
      (error) => {
        console.log(error.text);
      }
    );
  };

  return (
    <Modal
      open={open}
      onClose={closeModal}
      className="signUpForm"
      sx={{
        ".MuiBox-root": {
          maxWidth: 1000,
          width: "100%",
          overflow: "scroll",
          position: "fixed",
          transform: "translate(-50%, -50%)",
          top: "50%",
          left: "50%",
          height: "100vh",
          maxHeight: 600,
          borderRadius: 2,
        },
      }}
    >
      <Box>
        <span className="closeBtn" onClick={closeModal}>
          <AiFillCloseCircle size="25px"></AiFillCloseCircle>
        </span>
        <div className={innerClasses}>
          <div className="signUpForm--left flex-col">
            <div className="flex-child">
              {textMainBase.title}
              <p>
                Hãy điền đầy đủ thông tin dưới đây để chúng mình có thể liên lạc
                với bạn trong khoảng thời gian sớm nhất nhé!
              </p>
              <div className="contact">
                {infoContact.map((info) => (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    className="contact__info"
                    key={info.data}
                    href={info.href || ""}
                  >
                    {info.icon}
                    <span>{info.data}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="signUpForm__footer flex-child">
              <DateTime time={dayOut} />
            </div>
          </div>
          <div className="signUpForm--right flex-col">
            <Formik
              initialValues={{
                masv: "",
                fullName: "",
                phone: "",
                email: "",
                class: "",
                answer: [],
                gender: "",
                message: "",
                facebook: "",
                date: "",
                isDeleted: false,
              }}
              validationSchema={Yup.object({
                masv: Yup.string().required("Vui Lòng Điền Trường Này"),
                fullName: Yup.string().required("Vui Lòng Điền Trường Này"),
                date: Yup.string().required("Vui Lòng Nhập Trường Này"),
                phone: Yup.string().required("Vui Lòng Điền Trường Này"),
                email: Yup.string()
                  .email("E-mail của bạn không hợp lệ")
                  .required("Vui Lòng Điền Trường Này"),
                class: Yup.string().required("Vui Lòng Điền Trường Này"),
                answer: Yup.array()
                  .required()
                  .min(1, "Vui Lòng Chọn Trường Này")
                  .max(2, "Chỉ chọn tối đa 2 ban"),
                gender: Yup.string().required("Vui Lòng Chọn Trường Này"),
                facebook: Yup.string().required("Vui Lòng Điền Trường Này"),
              })}
              onSubmit={(values) => {
                handleSignUp(values);
                props.stateFunc();
              }}
            >
              {({ errors, touched }) => {
                return (
                  <Form>
                    <div className="basic-info gridCol-2 flex-child">
                      {basicQues.map((item) => (
                        <div className="basic-info__item" key={item.quesTitle}>
                          <Field
                            type="text"
                            placeholder=" "
                            name={item.quesName}
                            id={item.quesName}
                          />
                          <label htmlFor={item.quesName} className="title">
                            {item.quesTitle}
                          </label>
                          {!!errors[item.quesName] &&
                            !!touched[item.quesName] && (
                              <span className="errorMessage">
                                {errors[item.quesName]}
                              </span>
                            )}
                        </div>
                      ))}
                    </div>
                    <div
                      className="choose-info flex-child"
                      role="group"
                      aria-labelledby="radio-group"
                    >
                      <label htmlFor={chooseOption.quesName} className="title">
                        {chooseOption.quesTitle}
                      </label>
                      <div style={{ display: "flex", gap: "10px" }}>
                        {chooseOption.ans.map((item) => (
                          <label style={{ color: "#000" }} key={item}>
                            <Field
                              type="radio"
                              name={chooseOption.quesName}
                              value={item}
                              style={{
                                marginRight: "5px",
                              }}
                            />
                            {item}
                          </label>
                        ))}
                      </div>
                      {!!errors.gender && !!touched.gender && (
                        <span
                          className="errorMessage"
                          style={{ width: "100%" }}
                        >
                          {errors.gender}
                        </span>
                      )}
                    </div>
                    <div
                      className="choose-info flex-child"
                      role="group"
                      aria-labelledby="checkbox-group"
                    >
                      <label htmlFor={chooseQues.quesName} className="title">
                        {chooseQues.quesTitle}
                      </label>
                      <div className="gridCol-2">
                        {chooseQues.ans.map((item) => (
                          <label style={{ color: "#000" }} key={item}>
                            <Field
                              type="checkbox"
                              name={chooseQues.quesName}
                              value={item}
                            />
                            {item}
                          </label>
                        ))}
                        {errors.answer && touched.answer ? (
                          <span className="errorMessage">{errors.answer}</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="message flex-col">
                      <label className="title flex-child">
                        {textMainBase.messageTitle}
                      </label>
                      <Field
                        className="message__text flex-child"
                        as="textarea"
                        name="message"
                        placeholder=""
                        rows={3}
                        type="text"
                      />
                    </div>
                    <div className="signUpForm__footer ">
                      <button className="button button-sm" onClick={closeModal}>
                        HUỶ
                      </button>
                      <button
                        className="button button-primary button-sm"
                        disabled={disabled}
                        type="submit"
                      >
                        NỘP
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

SignUpForm.propTypes = propTypes;
SignUpForm.defaultProps = defaultProps;

export default SignUpForm;
