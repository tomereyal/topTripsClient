import React, { Dispatch, SetStateAction, useState } from "react";
import { Modal, Button, Form, Input, InputNumber, DatePicker } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { VacationModel } from "../../../models/vacation.model";
import moment from "moment";
import {
  useCreateVacationMutation,
  useUpdateVacationMutation,
  useUploadImageMutation,
} from "../../../app/services/tripsApi";
import styled from "styled-components";

const UploaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  min-height: 100px;
`;

const PasteContentInputContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const { RangePicker } = DatePicker;

interface IEditModal {
  isShown: boolean;
  setIsShown: Dispatch<SetStateAction<boolean>>;
  vacation: VacationModel | null;
}

export default function AdminUpdateModal(props: IEditModal) {
  const [createVacation, { isLoading: isCreating }] =
    useCreateVacationMutation();
  const [updateVacation, { isLoading: isUpdating }] =
    useUpdateVacationMutation();
  const [uploadImage] = useUploadImageMutation();
  const { isShown, setIsShown, vacation } = props;
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [currentUrl, setCurrentUrl] = useState(
    vacation && vacation.url ? vacation.url : ""
  );

  let initialFormValues = {};

  if (vacation !== null) {
    const { title, description, price, fromDate, toDate, id } = vacation;
    initialFormValues = {
      title,
      description,
      price,
      rangePicker: [
        moment(fromDate, "DD-MM-YYYY"),
        moment(toDate, "DD-MM-YYYY"),
      ],
    };
  }
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setIsShown(false);
  };
  const onFinish = async (fieldValues: any) => {
    console.log(`fieldValues `, fieldValues);
    const rangeValue = fieldValues["rangePicker"];
    handleSubmitFile(); //upload base64encodedimage to cloudinary database using tripApi server, set currentUrl

    const values = {
      ...fieldValues,
      fromDate: rangeValue[0].format("YYYY-MM-DD"),
      toDate: rangeValue[1].format("YYYY-MM-DD"),
      url: currentUrl,
    };
    delete values.rangePicker;
    console.log(`values`, values);
    if (!vacation) {
      createVacation(values)
        .unwrap()
        .then(() => {
          setCurrentUrl("");
          setIsShown(false);
        });
    } else {
      values["id"] = vacation.id;
      updateVacation(values)
        .unwrap()
        .then(() => {
          setCurrentUrl("");
          setIsShown(false);
        });
    }
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const handleFileInputChange = (e: any) => {
    const file = e.target.files[0];
    previewFile(file);
  };

  const previewFile = (file: any) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const fileUrl = reader.result as string;
        setCurrentUrl(fileUrl); //as a base64EncodedImage
      };
    } catch (error) {
      console.log(`error`, error);
    }
  };

  const handleSubmitFile = () => {
    if (!currentUrl) return;
    uploadImage(currentUrl)
      .unwrap()
      .then((fulfilled) => {
        console.log(`fulfilled`, fulfilled);
        if (fulfilled.url) setCurrentUrl(fulfilled.url);
      })
      .catch((rejected) => console.error(rejected));
  };

  const pasteClipboardText = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        setCurrentUrl(text);
      })
      .catch((err) => {
        // maybe user didn't grant access to read from clipboard
        console.log("Something went wrong", err);
      });
  };

  return (
    <Modal
      title={vacation ? "Edit Vacation" : "Create A Vacation"}
      visible={isShown}
      footer={null}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Form
        {...layout}
        name="vacation_form"
        onFinish={onFinish}
        validateMessages={validateMessages}
        initialValues={initialFormValues}
      >
        <Form.Item name={"title"} label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={"description"} label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name={"price"}
          label="Price"
          rules={[{ type: "number", min: 0, max: 20000 }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item name="rangePicker" label="RangePicker">
          <RangePicker format="DD-MM-YYYY" />
        </Form.Item>

        <Form.Item label="Uploader">
          <UploaderContainer>
            <input type="file" onChange={handleFileInputChange} name="image" />
            <span>-or-</span>
            <PasteContentInputContainer>
              <Button
                icon={<CopyOutlined />}
                onClick={() => pasteClipboardText()}
              >
                Paste From Clipboard
              </Button>
            </PasteContentInputContainer>
            <div>
              <img src={currentUrl} width={"300px"} />
            </div>
          </UploaderContainer>
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

//image upload tutrial by James Q Quick : https://www.youtube.com/watch?v=Rw_QeJLnCK4
