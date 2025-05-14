import { getUserList } from '@/services/system/user';
import type { ActionType, ProColumns,} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Input, message } from 'antd';
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

  const columns: ProColumns<any>[] = [
    {
      title: '用户名',
      dataIndex: 'userName',
      valueType: 'text',
    },
    {
      title: "账号",
      dataIndex: 'loginAccount',
      valueType: 'text',
    },
    {
      title: '联系电话',
      dataIndex: 'contactTel',
      valueType: 'text',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
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
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return (
            <Input
              {...rest}
              placeholder={intl.formatMessage({
                id: 'pages.searchTable.exception',
                defaultMessage: 'Please enter the reason for the exception!',
              })}
            />
          );
        }
        return defaultRender(item);
      },
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
          status: 'Processing',
        },
        2: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.online" defaultMessage="Online" />
          ),
          status: 'Success',
        },
      },
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
          分配角色
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
        request={getUserList}
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
