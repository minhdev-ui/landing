// const handleUpdatePost = async (e) => {
//     e.preventDefault();
//     const updateData = doc(db, "posts", postId);
//     await updateDoc(updateData, {
//       title: updateTitle,
//     });
//   };
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@mui/material";
import { serverTimestamp, doc, updateDoc } from "firebase/firestore";
import createNotification from "../../../components/elements/Nofication";
import db from "../../../db.config";
import {
  getStorage,
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
let urlImg = "";

const storage = getStorage();

// Create a reference to the file to delete

const UpdateArticle = ({ post }) => {
  const [postId, setPostId] = useState();
  useEffect(() => {
    setPostId(post.id);
  }, []);

  function deleteImage() {
    const desertRef = ref(storage, "images/desert.jpg");

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
  }

  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [targetInpuImage, setTargetInputImage] = useState("");
  const handleDeletePreviewImage = (image, targetInpuImage) => {
    setImage("");
    targetInpuImage.value = null;
  };
  const handleUploadImage = (image) => {
    if (!image) return "";
    else if (image) {
      image.preview = URL.createObjectURL(image);
      const file = image;
      const storageRef = ref(storage, "images/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              console.log("Nothing");
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            // urlImg = downloadURL;
            setUrl(downloadURL);
          });
        }
      );
    }
  };

  useEffect(() => {
    return () => {
      image && URL.revokeObjectURL(image.preview);
    };
  }, [image]);

  const handleSubmit = async (obj) => {
    try {
      let tags = obj.tags.split(" ");

      const updateData = doc(db, "article", postId);
      await updateDoc(updateData, { ...obj, tags, image:url });
      createNotification("success", "Cập nhật thành công");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      createNotification("error", "Cập nhật thất bại");
      console.log(err);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          title: post.title || "",
          shortDes: post.shortDes || "",
          categorize: post.categorize || "",
          text: post.text || "",
          tags: post.tags || "",
          image: post.image || "",
          imageName: post.imageName || "",
        }}
        onSubmit={(values) => {
          handleSubmit({ ...values, updatedAt: serverTimestamp() });
        }}
      >
        {({ errors, touched, setFieldValue }) => {
          return (
            <Form>
              <div className="group_article">
                <div>
                  <label className="article_name_tag">Title</label>
                  <Field
                    className="input"
                    name="title"
                    placeholder="Enter Article's Title"
                  ></Field>
                </div>
                <div>
                  <label className="article_name_tag">Short Description</label>
                  <Field
                    className="input"
                    name="shortDes"
                    placeholder="Enter Your Short Description . . ."
                  ></Field>
                </div>
                <div>
                  <label className="article_name_tag">Tags</label>
                  <Field
                    className="input"
                    name="tags"
                    placeholder="Enter Your Tags . . ."
                  ></Field>
                </div>
                <div>
                  <label className="article_name_tag">Categorize</label>
                  <div
                    className="article_name_tag_group"
                    role="group"
                    aria-labelledby="my-radio-group"
                  >
                    <label>
                      <Field type="radio" name="categorize" value="Blog" />
                      Blog
                    </label>
                    <label>
                      <Field type="radio" name="categorize" value="Event" />
                      Event
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="article_name_tag">Photo</label>
                <Field
                  render={({ field }) => {
                    return (
                      <>
                        <input
                          type="file"
                          className="input file"
                          onChange={(e) => {
                            setFieldValue("image", e.target.files[0]);
                            setImage(e.target.files[0]);
                            handleUploadImage(e.target.files[0]);
                            setTargetInputImage(e.target); // for delete
                          }}
                        />
                      </>
                    );
                  }}
                />
                {image && (
                  <Button
                    variant="contained"
                    type="button"
                    sx={{ marginBottom: "10px" }}
                    onClick={() => {
                      handleDeletePreviewImage(image, targetInpuImage);
                    }}
                  >
                    Delete Image
                  </Button>
                )}
                {image && (
                  <div className="article_image_preview">
                    <img src={image.preview} alt="" width="300px" />
                  </div>
                )}
              </div>
              <Field
                render={({ field }) => {
                  return (
                    <ReactQuill
                      theme="snow"
                      value={field.value.text}
                      onChange={(value) => setFieldValue("text", value)}
                    />
                  );
                }}
              />

              <Button
                type="submit"
                variant="contained"
                sx={{ marginBottom: "10px" }}
              >
                Update
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default UpdateArticle;
