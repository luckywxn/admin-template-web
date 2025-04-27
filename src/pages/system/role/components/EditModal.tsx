import { addRole, updateRule } from '@/services/system/role';
import ProForm, {
  ProFormText,
  ProFormSwitch,
} from '@ant-design/pro-form';
import { message, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';
import React, { useRef } from 'react';

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

  console.log(props);
  const { id, roleName, roleRemark, status } = target;
  console.log(target);

  const [messageApi, contextHolder] = message.useMessage();

  // const { run ,loading} = useRequest(updateRule, {
  //   manual: true,
  //   onSuccess: () => {
  //     messageApi.success('Configuration is successful');
  //   },
  //   onError: () => {
  //     messageApi.error('Configuration failed, please try again!');
  //   },
  // });

  const handleOk = () => {
    actionRef.current?.validateFields().then((res: any) => {
      const { roleName, roleRemark, status } = res;
      let params: any = {
        roleName,
        roleRemark,
        status,
      };
      console.log(id)
      if (id) {
        params.id = id;
        updateRule(params).then((response) => {
          if (response.code === 200) {
            closeEditModal();
            message.success('修改成功!');
          }
        });
      } else {
        addRole(params).then((response) => {
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
        title={id ? '编辑' : '添加'}
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
            name="roleName"
            label = "角色名称"
            initialValue={roleName}
            disabled={!!id}
            rules={[
              {
                required: true,
                message: "角色名称为必填项",
              },
            ]}
            width="md"
          />
          <ProFormText
            name="roleRemark"
            label = "角色说明"
            width="md"
            initialValue={roleRemark}
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
