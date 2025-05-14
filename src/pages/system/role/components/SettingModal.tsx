import { Modal, message, Tree } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { FormInstance } from 'antd/lib/form';
import { getRolePermission, submitEditRolePermission } from '@/services/system/role';

export type InitProps = {
  settingVisible: boolean;
  target: any;
  close: () => void;
  closeSettingModal: () => void;
};

const CreateModal: React.FC<InitProps> = (props) => {
  const actionRef = useRef<FormInstance>();
  const [tree, setTree] = useState([]);

  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [checkedKeysResult, setCheckedKeysResult] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const { close, closeSettingModal, target, settingVisible } = props;
  const { id } = target;

  useEffect(() => {
    if (settingVisible) {
      let params = {
        roleId: id,
      };
      getRolePermission(params).then((res) => {
        let treeData = [];
        var relCheckedKeys: any = [];
        var relCheckedKeysResult: any = [];
        treeData = res?.data?.map((item: any) => {
          return formatItem(item, relCheckedKeys, relCheckedKeysResult);
        });
        console.log(treeData);
        setTree(treeData);
      });
    }
  }, [settingVisible]);

  const formatItem = (item: any, relCheckedKeys: any, relCheckedKeysResult: any) => {
    if (item.hasPermission) {
      relCheckedKeys.push(item.id);
      setCheckedKeysResult(relCheckedKeys);
    }
    if (item.hasPermission && item.children.length == 0) {
      relCheckedKeysResult.push(item.id);
      setCheckedKeys(relCheckedKeysResult);
    }
    return {
      title: item.permissionName,
      key: item.id,
      id: item.id,
      parentId: item.parentId,
      children: item.children
        ? item.children.map((i: any) => formatItem(i, relCheckedKeys, relCheckedKeysResult))
        : [],
    };
  };
  const handleOk = () => {
    actionRef.current?.validateFields().then((res: any) => {
      let permissionIds: any = [];
      checkedKeysResult.map((item) => {
        permissionIds.push(item);
      });
      let params = {
        permissionIds: permissionIds,
        roleId: id,
      };
      submitEditRolePermission(params).then((response) => {
        if (response.code === 200) {
          message.success('配置权限成功');
          closeSettingModal();
          setCheckedKeys([]);
          setCheckedKeysResult([]);
        }
      });
    });
  };

  const handleCancel = () => {
    close();
    setCheckedKeys([]);
    setCheckedKeysResult([]);
  };

  const onCheck = (checkedKeysValue: React.Key[], info: any) => {
    let checkedKeysResult = [...checkedKeysValue, ...info.halfCheckedKeys];
    setCheckedKeys(checkedKeysValue);
    setCheckedKeysResult(checkedKeysResult);
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    setSelectedKeys(selectedKeysValue);
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
        <Tree
          checkable
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          onSelect={onSelect}
          selectedKeys={selectedKeys}
          treeData={tree}
        />
      </ProForm>
    </Modal>
  );
};

export default CreateModal;
