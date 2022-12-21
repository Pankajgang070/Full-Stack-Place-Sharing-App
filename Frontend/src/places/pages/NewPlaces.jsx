import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../shared/hooks/form-hook";

import "./PlaceForm.css";

import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/Util/validator";
import Button from "../../shared/components/FormElements/Buttons";
import { useHttpClent } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUplaod from "../../shared/components/FormElements/ImageUpload";

const NewPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClent();
  const auth = useContext(AuthContext);

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const navigate = useNavigate();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);

      await sendRequest(process.env.REACT_APP_BACKEND_URL + '/places', "POST", formData, {
        Authorization: "Bearer " + auth.token,
      });
      navigate("/");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Enter a Valid Title!"
          onInput={inputHandler}
        />

        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Enter a Description (min. length 5 !)."
          onInput={inputHandler}
        />

        <Input
          id="address"
          element="textarea"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Enter a valid Address!."
          onInput={inputHandler}
        />

        <ImageUplaod
          id="image"
          onInput={inputHandler}
          errorText="Please Provide a Valid Image!"
        />

        <Button type="submit" disabled={!formState.isValid}>
          {" "}
          ADD PLACE{" "}
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlaces;
