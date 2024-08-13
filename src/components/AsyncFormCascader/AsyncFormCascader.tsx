import React, {
  type FC,
  type ComponentProps,
  useState,
  useEffect,
} from 'react';
import { Form, Spin } from '@douyinfe/semi-ui';
import type { CascaderData } from '@douyinfe/semi-ui/lib/es/cascader';

export type AsyncFormCascaderProps = ComponentProps<typeof Form.Cascader> & {
  fetchData: () => Promise<CascaderData[]>;
};

const AsyncFormCascader: FC<AsyncFormCascaderProps> = (props) => {
  const { fetchData, ...rest } = props;
  const [options, setOptions] = useState<CascaderData[]>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log(rest)
    setLoading(true);
    setOptions(undefined)
      try {
     fetchData().then(setOptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }

  }, [fetchData]);

  return (
    <Form.Cascader
      {...rest}
      emptyContent={
        loading ? <Spin style={{ width: 80 }} tip='' /> : <div>暂无数据</div>
      }
      placeholder='请选择工作项或模版'
      treeData={options}
    />
  );
};

export default AsyncFormCascader;
