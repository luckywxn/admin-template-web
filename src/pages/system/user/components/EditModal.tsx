import { addUser,updateUser } from '@/services/system/user';
import ProForm, {
  ProFormText,
  ProFormSwitch,
} from '@ant-design/pro-form';
import { message, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';
import React, { useState,useRef } from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RoleListItem>;

export type InitProps = {
  createVisible: boolean;
  target: any;
  close: () => void;
  closeEditModal: () => void;
};

const UpdateForm: React.FC<InitProps> = (props) => {
  const actionRef = useRef<FormInstance>();
  const { close, closeEditModal, target, createVisible } = props;
  const { id, userName, loginAccount, contactTel,email,status } = target;

  const [messageApi, contextHolder] = message.useMessage();

  const handleOk = () => {
    actionRef.current?.validateFields().then((res: any) => {
      const { userName, loginAccount, contactTel, email, tatus } = res;
      let params: any = {
        userName,
        loginAccount,
        contactTel,
        email,
        status,
      };
      console.log(id)
      if (id) {
        params.id = id;
        updateUser(params).then((response) => {
          if (response.code === 200) {
            closeEditModal();
            message.success('修改成功!');
          }
        });
      } else {
        addUser(params).then((response) => {
          if (response.code === 200) {
            closeEditModal();
            message.success('添加成功!');
          }
        });
      }
    });
  }

  const handleCancel = () => {
    close();
  }

  return (
    <>
      {contextHolder}
      <Modal
        title="编辑用户"
        open={createVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        destroyOnClose
      >
        <ProForm
          formRef={actionRef}
          submitter={{
            resetButtonProps: {
              style: {
                display: 'none',
              },
            },
            submitButtonProps: {
              style: {
                display: 'none',
              },
            },
          }}
        >
          <ProFormText
            name="userName"
            label = "用户名称"
            rules={[
              {
                required: true,
                message: "用户名称为必填项",
              },
            ]}
            width="md"
            initialValue={userName}
          />
          <ProFormText
            name="loginAccount"
            label = "账号"
            width="md"
            initialValue={loginAccount}
          />
          <ProFormText
            name="contactTel"
            label = "联系电话"
            width="md"
            initialValue={contactTel}
          />
          <ProFormText
            name="email"
            label = "邮箱"
            width="md"
            initialValue={email}
          />
          <ProFormSwitch
            name="status"
            label = "状态"
            width="md"
            initialValue={status}
          />
        </ProForm>
      </Modal>
    </>
  );
};

export default UpdateForm;
