import React, {
  type ReactNode,
  // type FC
  type ReactElement,
  useState,
  useEffect,
  useContext,
} from 'react';
// import Header from './Header';
import {
  Empty,
  Layout,
  Button,
  List,
  Typography, Toast
} from '@douyinfe/semi-ui';
import { type PaginationProps } from '@douyinfe/semi-ui/lib/es/pagination';
import { type ButtonProps } from '@douyinfe/semi-ui/lib/es/button';
import { type ListProps } from '@douyinfe/semi-ui/lib/es/list';
import { IconPlusCircle } from '@douyinfe/semi-icons';
import { ConfigContext } from '../../context/configContext';

interface Props<T> extends ListProps<T> {
  onClickAdd: ButtonProps['onClick']; // 新建按钮的点击事件
  title: string; // 标题
  addBtnText: string; // 新建按钮的文案
  headerContent?: ReactNode | null;
  pagination?: false | PaginationProps; // 分页
  forceUpdataFlag: number;
  fetchData: () => Promise<{
    rules?: T[];
  }>;
}

const {Header,Content}=Layout
const {Title,Text}=Typography

function ConfigList<T extends Record<string, any>>(
  props: Props<T>
): ReactElement {
  const [list, setList] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const { setTemplateList } = useContext(ConfigContext);
  const {
    title,
    onClickAdd = () => {},
    addBtnText = '添加流转规则',
    headerContent = null,
    fetchData,
    renderItem = (item, i) => i,
    forceUpdataFlag = 0,
    ...rest
  } = props;

  useEffect(() => {
    setLoading(true);
    try {
      fetchData()
          .then(({rules}) => {
            // 存储已经配置过的模版
            setTemplateList((rules ?? []).map((item) => item.template.id));
            setList(rules ?? []);
          })
    }
    catch{
      Toast.info("请稍等，加载中")
    }
    finally {
      setLoading(false);
    }
  }, [fetchData, forceUpdataFlag]);

  return (
    <Layout>
      <Header style={{ display: 'flex', padding: '12px 24px' }}>
        <Title heading={5}>{title}</Title>
        {headerContent && <div style={{ flex: 1 }}>{headerContent}</div>}
        <Button
          icon={<IconPlusCircle />}
          theme='solid'
          onClick={onClickAdd}
        >
          {addBtnText}
        </Button>
      </Header>
      <Content>
        <List
          loading={loading}
          dataSource={list}
          split={false}
          renderItem={(item: T, i) => (
            <List.Item key={item.id || i} style={{ display: 'block' }}>
              {renderItem(item, i)}
            </List.Item>
          )}
          emptyContent={
            <Empty
              style={{ marginTop: '10vh' }}
              // size='large'
              title={'暂无数据'}
            >
              <Text>
                {"请先添加规则，然后再操作"}
                <Text
                  style={{ marginLeft: 4 }}
                  link
                  onClick={onClickAdd}
                >
                  {addBtnText}
                </Text>
              </Text>
            </Empty>
          }
          {...rest}
        />
      </Content>
    </Layout>
  );
}

// 设置参数默认值
export default ConfigList;
