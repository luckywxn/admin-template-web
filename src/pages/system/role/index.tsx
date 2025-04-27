import { removeRule, getRoleList } from '@/services/system/role';
import type { ActionType, ProColumns} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import SettingModal from './components/SettingModal';
import EditModal from './components/EditModal';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [settingVisible, setSettingVisible] = useState<boolean>(false);
  const [target, setTarget] = useState<any>({});


  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const [messageApi, contextHolder] = message.useMessage();

  const { run: delRun, loading } = useRequest(removeRule, {
    manual: true,
    onSuccess: () => {
      actionRef.current?.reloadAndRest?.();

      messageApi.success('Deleted successfully and will refresh soon');
    },
    onError: () => {
      messageApi.error('Delete failed, please try again');
    },
  });

  const columns: ProColumns<API.RoleListItem>[] = [
    {
      title: "角色名称",
      dataIndex: 'roleName',
    },
    {
      title: "角色说明",
      dataIndex: 'roleRemark',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="Status" />,
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        1: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.running" defaultMessage="Running" />
          ),
          status: 'Success',
        },
        2: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.online" defaultMessage="Online" />
          ),
          status: 'Failed',
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.titleCreatedAt"
          defaultMessage="Last scheduled time"
        />
      ),
      sorter: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setTarget(record);
            setEditVisible(true);
          }}
        >
          编辑名称
        </a>,
        <a
          key="config"
          onClick={() => {
            setTarget(record);
            setSettingVisible(true);
          }}
        >
          配置权限
        </a>
      ],
    },
  ];

  const closeEditModal = () => {
    setEditVisible(false);
    setTarget({});
    actionRef?.current?.reload();
  };
  
  const closeSettingModal = () => {
    setSettingVisible(false);
    setTarget({});
    actionRef?.current?.reload();
  };

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<API.RoleListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setEditVisible(true);
            }}
          >
            <PlusOutlined /> 添加
          </Button>,
        ]}
        request={getRoleList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
          },
        }}
      />
       <EditModal
        createVisible={editVisible}
        closeEditModal={closeEditModal}
        close={() => {
          setEditVisible(false), setTarget({});
        }}
        target={target}
       />
       <SettingModal
         settingVisible={settingVisible}
         closeSettingModal={closeSettingModal}
         close={() => {
           setSettingVisible(false), setTarget({});
         }}
         target={target}
       />
    </PageContainer>
  );
};

export default TableList;
