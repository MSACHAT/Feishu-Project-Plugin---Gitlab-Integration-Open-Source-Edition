import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Collapse, Typography, Table, Toast, Popover, Spin } from '@douyinfe/semi-ui';
import { getBindings, deleteBindings } from '../../api/service';
import './index.less';
import { IconTreeTriangleRight } from '@douyinfe/semi-icons';

import { APP_KEY } from '../../constants';
import useSdkContext from '../../hooks/useSdkContext';

enum ITabType {
  MR = 1,
  COMMIT,
  BRANCH,
}

const { Text } = Typography;

const formateTime = time => {
  const date = new Date(time * 1000);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  return `${y}-${m}-${d}`;
};

const renderUsers = users => {
  if (users && !Array.isArray(users)) users = [users];
  const userEmails = users?.map(user => user.email) || [];
  if (userEmails.length > 1) {
    return (
      <div className="user-cell">
        <Text ellipsis={{ showTooltip: true }} className="email">
          {userEmails[0]}
        </Text>
        <Popover
          position="top"
          content={
            <div style={{ padding: '12px' }}>
              {userEmails.map(email => (
                <div>{`${email}`}</div>
              ))}
            </div>
          }
        >
          <span className="more">{`+${userEmails.length}`}</span>
        </Popover>
      </div>
    );
  } else {
    return <BaseCell>{userEmails[0]}</BaseCell>;
  }
};

const renderTitle = (type, text, record, maxToolTipWidth?) => {
  const { repository = {}, url } = record;
  if (url || repository?.url) {
    const href = {
      [ITabType.MR]: url || repository?.url,
      [ITabType.COMMIT]: `${repository?.url || url}/commit/${record?.commit_id}`,
      [ITabType.BRANCH]: `${repository?.url || url}/tree/${record?.name}?`,
    };
    return (
      <BaseCell
        className="title-cell link-cell"
        link={{ href: href[type], target: '_blank' }}
        maxToolTipWidth={maxToolTipWidth}
      >
        {text}
      </BaseCell>
    );
  } else {
    return (
      <BaseCell className="title-cell" maxToolTipWidth={maxToolTipWidth}>
        {text}
      </BaseCell>
    );
  }
};

const BaseCell = props => {
  const { children, maxToolTipWidth, ...res } = props;
  return (
    <Text
      ellipsis={{
        showTooltip: {
          opts: {
            content: children,
            style: {
              wordBreak: 'break-all',
              maxWidth: maxToolTipWidth ?? '240px',
            },
          },
        },
      }}
      {...props}
      children={children || '-'}
    />
  );
};

const getWorkItemIdFormUrl = () => {
  if (window && window.parent) {
    const res =
      window.parent.location.href.match(/(?:detail\/)([0-9]+)/) ||
      window.parent.location.href.match(/(?:issueId\=)([0-9]+)/) ||
      window.parent.location.href.match(/(?:storyId\=)([0-9]+)/);
    if (res) {
      return res[1];
    }
  }
  return '';
};

export default hot(() => {
  const [bindings, setBindings] = useState<any>([]);
  const { mainSpace } = useSdkContext() || {};
  const project_key = mainSpace?.id ?? '';
  const workitem_id = getWorkItemIdFormUrl();
  const [loading, setLoading] = useState(false);
  const [inited, setInited] = useState(false);
  const [showTip, setShowTip] = useState(false);

  const deleteBinding = useCallback(
    id => {
      deleteBindings({
        project_key,
        workitem_id,
        id,
      })
        .then(res => {
          getBindings({ project_key, workitem_id })
            .then(res => {
              if (res.data) {
                setBindings(res.data);
              }
            })
            .finally(() => {
              setLoading(false);
            });
        })
        .catch(e => {
          setLoading(false);
          Toast.error(e.message || '请求失败，请稍后重试');
        });
    },
    [project_key, workitem_id],
  );

  useEffect(() => {
    setLoading(true);
    getBindings({ project_key, workitem_id })
      .then(res => {
        if (res.data) {
          setBindings(res.data);
        }
      })
      .finally(() => {
        setInited(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (inited) {
      try {
        const info = JSON.parse(window?.parent?.localStorage?.getItem(APP_KEY) || '{}');
        if (!info.visited_tab) {
          setShowTip(true);
        }
      } catch (e) {}
    }
  }, [inited]);

  const MRColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      width: 210,
      render: (text, record, index) => renderTitle(ITabType.MR, text, record),
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 84,
      render: (text, record, index) => <BaseCell>{text}</BaseCell>,
    },
    {
      title: '仓库',
      dataIndex: 'repository',
      width: 84,
      render: val => <BaseCell>{val?.path_with_namespace}</BaseCell>,
    },
    {
      title: '原分支',
      dataIndex: 'source_branch',
      width: 84,
      render: (text, record, index) => <BaseCell>{text}</BaseCell>,
    },
    {
      title: '目标分支',
      dataIndex: 'target_branch',
      width: 84,
      render: (text, record, index) => <BaseCell>{text}</BaseCell>,
    },
    {
      title: '作者',
      dataIndex: 'developers',
      width: 132,
      render: (val, record, index) => renderUsers(val),
    },
    {
      title: bruteTranslate('reviewer'),
      dataIndex: 'reviewers',
      width: 139,
      render: (val, record, index) => renderUsers(val),
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      width: 98,
      render: (val, record, index) => <BaseCell>{formateTime(val)}</BaseCell>,
    },
    {
      width: 65,
      dataIndex: 'deletable',
      // fixed: bindings['merge_request']?.length > 0 ? 'right' : undefined,
      render: (val, record) => (
        <Typography.Text
          className="action"
          link={val}
          disabled={!val}
          onClick={() => val && deleteBinding(record.id)}
        >
          {'解绑'}
        </Typography.Text>
      ),
    },
  ];

  const RenderCommitTable = [
    {
      title: bruteTranslate('ID'),
      dataIndex: 'commit_id',
      width: 155,
      render: (text, record, index) =>
        renderTitle(ITabType.COMMIT, text || record?.id || '', record, '185px'),
    },
    {
      title: '提交信息',
      dataIndex: 'message',
      width: 240,
      render: (text, record, index) => <BaseCell>{text}</BaseCell>,
    },
    {
      title: '仓库',
      dataIndex: 'repository',
      width: 131,
      render: val => <BaseCell>{val?.path_with_namespace}</BaseCell>,
    },
    {
      title: '分支',
      dataIndex: 'branch',
      width: 120,
      render: val => <BaseCell>{val}</BaseCell>,
    },
    {
      title: '作者',
      dataIndex: 'author',
      width: 147,
      render: (val, record, index) => renderUsers(val),
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      width: 183,
      render: (val, record, index) => <BaseCell>{formateTime(val)}</BaseCell>,
    },
    {
      width: 65,
      dataIndex: 'deletable',
      // fixed: bindings.commit?.length > 0 ? 'right' : false,
      render: (val, record) => (
        <Typography.Text
          className="action"
          link={val}
          disabled={!val}
          onClick={() => val && deleteBinding(record.id)}
        >
          {'解绑'}
        </Typography.Text>
      ),
    },
  ];

  const RenderBranchTable = [
    {
      title: '分支信息',
      dataIndex: 'name',
      width: 343,
      render: (text, record, index) => renderTitle(ITabType.BRANCH, text, record),
    },
    {
      title: '代码仓库',
      dataIndex: 'repository',
      width: 309,
      render: (text, record, index) => <BaseCell>{text?.path_with_namespace}</BaseCell>,
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      width: 252,
      render: (val, record, index) => <BaseCell>{formateTime(val)}</BaseCell>,
    },
    {
      width: 65,
      dataIndex: 'deletable',
      // fixed: bindings.branch?.length > 0 ? 'right' : false,
      render: (val, record) => (
        <Typography.Text
          className="action"
          link={val}
          disabled={!val}
          onClick={() => {
            val && deleteBinding(record.id);
          }}
        >
          {'解绑'}
        </Typography.Text>
      ),
    },
  ];

  const defaultActiveKey = useMemo(() => {
    const keys: string[] = [];
    Object.keys(bindings).forEach(key => {
      if (bindings[key]?.length > 0) keys.push(key);
    });
    return keys;
  }, [bindings]);

  // const TipContent = (
  //   <div className='meego-plugin-gitlab-tip-popver'>
  //     <div className='meego-plugin-gitlab-tip-popver-title'>
  //       {bruteTranslate('插件升级，使用方式更新')} 📖
  //     </div>
  //     <div className='meego-plugin-gitlab-tip-popver-info'>
  //       {bruteTranslate(
  //         `使用 {command} 一键复制ID，在 {action} 中使用该ID可关联/流转工作项，详情参考 {helpLink}`,
  //         {
  //           command: (
  //             <span className='meego-plugin-gitlab-tip-popver-info-command'>
  //               {isMac()
  //                 ? bruteTranslate('⌘+⇧+C')
  //                 : bruteTranslate('Ctrl + Shift + c')}
  //             </span>
  //           ),
  //           action: (
  //             <span className='meego-plugin-gitlab-tip-popver-info-command'>
  //               {bruteTranslate('commit/branch/MR')}
  //             </span>
  //           ),
  //           action2: (
  //             <span className='meego-plugin-gitlab-tip-popver-info-command'>
  //               {bruteTranslate('resolve F-####')}
  //             </span>
  //           ),
  //           helpLink: (
  //             <Typography.Text
  //               link={{
  //                 href: isKa()
  //                   ? 'https://project.feishu.cn/kahelpcenter/articles/531175268886'
  //                   : 'https://bytedance.feishu.cn/docx/doxcnMmY76oEeWg8Rw8NmYCAsbc',
  //                 target: '_blank',
  //               }}
  //               onClick={() => {
  //                 logEvent('detail_main_page_tab_click', {
  //                   click: 'check_help',
  //                 });
  //               }}
  //             >
  //               {bruteTranslate('帮助文档')}
  //             </Typography.Text>
  //           ),
  //         }
  //       )}
  //     </div>
  //     <div className='meego-plugin-gitlab-tip-popver-footer'>
  //       <Button
  //         theme='light'
  //         type='primary'
  //         onClick={() => {
  //           window?.parent?.localStorage?.setItem(
  //             APP_KEY,
  //             JSON.stringify({ visited_tab: true })
  //           );
  //           setShowTip(false);
  //         }}
  //       >
  //         {bruteTranslate('我知道了')}
  //       </Button>
  //     </div>
  //   </div>
  // );

  // const RenderTip = () => {
  //   return (
  //     <Popover
  //       content={TipContent}
  //       position='topLeft'
  //       visible={showTip}
  //       trigger='custom'
  //     >
  //       <div className='meego-plugin-gitlab-tip' />
  //     </Popover>
  //   );
  // };

  return (
    <div className="meego-plugin-gitlab-tab-container">
      {/* <div className='meego-plugin-gitlab-help-link'>
        <Typography.Text
          link={{
            href: isKa()
              ? 'https://project.feishu.cn/kahelpcenter/articles/531175268886'
              : 'https://bytedance.feishu.cn/docx/doxcnMmY76oEeWg8Rw8NmYCAsbc',
            target: '_blank',
          }}
          onClick={() => {
            logEvent('detail_main_page_tab_click', { click: 'check_help' });
          }}
        >
          <IconLink size={'extra-small'} />
          {bruteTranslate('查看帮助文档')}
        </Typography.Text>
      </div> */}
      <Spin spinning={loading}>
        <div className="meego-plugin-gitlab-tab">
          {inited && (
            <Collapse
              expandIconPosition="left"
              defaultActiveKey={defaultActiveKey}
              expandIcon={<IconTreeTriangleRight size={'extra-small'} />}
              collapseIcon={
                <IconTreeTriangleRight
                  size={'extra-small'}
                  style={{ transform: 'rotate(90deg)' }}
                />
              }
            >
              <Collapse.Panel
                header={`Pull Request${
                  bindings['merge_request']?.length > 0
                    ? ` · ${bindings['merge_request'].length}`
                    : ''
                } `}
                itemKey="merge_request"
              >
                <Table
                  bordered
                  columns={MRColumns}
                  dataSource={bindings['merge_request']}
                  scroll={{
                    x: bindings['merge_request']?.length > 0 ? '105%' : '100%',
                  }}
                  pagination={false}
                  empty={'暂无数据'}
                />
              </Collapse.Panel>
              <Collapse.Panel
                header={`Commit${
                  bindings?.commit?.length > 0 ? ` · ${bindings?.commit.length}` : ''
                } `}
                itemKey="commit"
              >
                <Table
                  bordered
                  columns={RenderCommitTable}
                  dataSource={bindings?.commit}
                  scroll={{
                    x: bindings?.commit?.length > 0 ? '105%' : '100%',
                  }}
                  pagination={false}
                  empty={'暂无数据'}
                />
              </Collapse.Panel>
              <Collapse.Panel
                header={`Branch${
                  bindings?.branch?.length > 0 ? ` · ${bindings.branch.length}` : ''
                } `}
                itemKey="branch"
              >
                <Table
                  bordered
                  columns={RenderBranchTable}
                  dataSource={bindings?.branch}
                  scroll={{
                    x: bindings?.branch?.length > 0 ? '105%' : '100%',
                  }}
                  pagination={false}
                  empty={'暂无数据'}
                />
              </Collapse.Panel>
            </Collapse>
          )}
        </div>
      </Spin>
      {/* <RenderTip></RenderTip> */}
    </div>
  );
});

function bruteTranslate(arg0: string) {
  throw new Error('Function not implemented.');
}
