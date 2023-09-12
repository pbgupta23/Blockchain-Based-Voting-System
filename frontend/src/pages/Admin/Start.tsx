import React, { useRef, useState } from "react";
import { Formik } from "formik";
import axios from "../../axios";
import * as yup from "yup";
import { Button } from "antd";

const schema = yup.object({
  name: yup.string().min(3).required(),
  description: yup.string().min(10).required(),
});

interface Candidate {
  name: string;
  info: string;
  pic?: string;
}

const Start = (props: any) => {
  const [candidates, setCandidates] = useState<Array<Candidate>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [pic, setPic] = useState<string>("");

  const candidateField = useRef<HTMLInputElement>(null);
  const candidateInfoField = useRef<HTMLInputElement>(null);

  return (
    <div className="form-container">
      {error !== "" ? <div className="error-message">{error}</div> : null}

      <Formik
        initialValues={{
          name: "",
          description: "",
        }}
        validationSchema={schema}
        onSubmit={({ name, description }) => {
          setLoading(true);

          let candidatesError = "";

          if (candidates.length < 2) candidatesError = "Not Enough Candidates";

          for (let i = 0; i < candidates.length; i++) {
            const candidate = candidates[i];

            if (candidate.name.length < 3) {
              candidatesError = "invalid name " + candidate.name;
              break;
            }

            if (candidate.info.length < 10) {
              candidatesError = "invalid info for " + candidate.name;
              break;
            }
          }

          setError(candidatesError);

          if (candidatesError === "") {
            axios
              .post("/polls/start", { name, description, candidates })
              .then((_) => {
                axios
                  .get("/polls/status")
                  .then((res) => {
                    props.setStatus(res.data.status);
                    setLoading(false);
                  })
                  .catch((error) => console.log({ error }));
              })
              .catch((err) => {
                let error = err.message;
                if (err?.response?.data) error = err.response.data;
                setError(error.slice(0, 50));
                setLoading(false);
              });
          }
        }}
      >
        {({ errors, touched, getFieldProps, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                id="name"
                type="text"
                placeholder="Poll Name"
                {...getFieldProps("name")}
              />

              <div className="form-error-text">
                {touched.name && errors.name ? errors.name : null}
              </div>
            </div>

            <div className="input-container">
              <input
                id="description"
                type="text"
                placeholder="Poll Description"
                {...getFieldProps("description")}
              />

              <div className="form-error-text">
                {touched.description && errors.description
                  ? errors.description
                  : null}
              </div>
            </div>

            {candidates.length !== 0 ? (
              <div className="candidates-container">
                {candidates.map(({ name, info, pic }, index) => (
                  <div key={index} className="candidate-wrapper">
                    <div>
                      <div>
                        {pic && (
                          <img
                            src={pic}
                            width={"100px"}
                            height={"100px"}
                            alt="candidate pc"
                          />
                        )}
                      </div>
                      <div>
                        <span>{name}</span>
                        <span
                          onClick={() => {
                            const newList = [...candidates];
                            const i = newList.indexOf({ name, info });
                            newList.splice(i, 1);

                            setCandidates(newList);
                          }}
                          className="remove"
                        >
                          <i className="bi bi-dash-circle"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="input-container">
              <div className="add-candidate-wrapper">
                <input
                  type="text"
                  placeholder="Add Candidate"
                  ref={candidateField}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />

                <button
                  className=""
                  type="button"
                  onClick={() => {
                    const newCandidate = {
                      name,
                      info,
                      pic,
                    };
                    setCandidates([...candidates, newCandidate]);
                    if (candidateField.current)
                      candidateField.current.value = "";
                    if (candidateInfoField.current)
                      candidateInfoField.current.value = "";
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="input-container">
              <div className="add-candidate-wrapper">
                <input
                  type="text"
                  placeholder="Candidate Info"
                  ref={candidateInfoField}
                  onChange={(e) => {
                    setInfo(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="input-container">
              <div className="add-candidate-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files![0];
                    const reader = new FileReader();

                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      setPic(`${reader.result as string}`);
                    };
                  }}
                />
              </div>
            </div>

            <Button
              className="login-button button-primary"
              htmlType="submit"
              loading={loading}
            >
              Start Election
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Start;
