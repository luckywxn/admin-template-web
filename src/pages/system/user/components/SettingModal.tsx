import { Modal, message, Transfer } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { FormInstance } from 'antd/lib/form';
import { getUserRoleByUserId,submitEditUserRole } from '@/services/system/user';


export type InitProps = {
  settingVisible: boolean;
  target: any;
  close: () => void;
  closeSettingModal: () => void;
};
interface RoleItem {
  id: string;
  title: string;
  hasRole?: boolean;
}

const CreateModal: React.FC<InitProps> = (props) => {
  const actionRef = useRef<FormInstance>();
  const { close, closeSettingModal, target, settingVisible } = props;

  const [allData, setAllData] = useState<RoleItem[]>([]);
  const [targetKeys, setTargetKeys] = useState<number[]>([]);

  const { id } = target;

  useEffect(() => {
    if (settingVisible) {
      let params = {
        userId: id,
      };
      getUserRoleByUserId(params).then((res) => {
        let roleData = res?.data;
        // 处理目标角色keys
        const initialTargetKeys = roleData
          .filter((item:any) => item.hasRole)
          .map((item:any)  => item.id);

        let data = roleData?.map((role:any) => ({
          key: role.id,
          title: role.roleName,
          description: role.roleDesc // 建议使用真实描述字段
        }));
        setAllData(data);
        setTargetKeys(initialTargetKeys);
      });
    }
  }, [settingVisible]);

  const handleChange = (newTargetKeys: number[]) => {
    setTargetKeys(newTargetKeys);
  };

  const handleOk = () => {
    actionRef.current?.validateFields().then((res: any) => {
      console.log("targetKeys",targetKeys);
      let params = {
        roleIds: targetKeys,
        userId: id,
      };
      submitEditUserRole(params).then((response) => {
        if (response.code === 200) {
          message.success('配置角色成功');
          closeSettingModal();
        }
      });
    });
  };

  const handleCancel = () => {
    close();
  };

  return (
    <Modal
      title="编辑角色权限"
      open={settingVisible}
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
        <Transfer
          dataSource={allData}
          targetKeys={targetKeys}
          onChange={handleChange}
          showSearch
          titles={['全部角色', '已分配角色']}
          render={(item:any) => item.title}
        />
      </ProForm>
    </Modal>
  );
};

export default CreateModal;
