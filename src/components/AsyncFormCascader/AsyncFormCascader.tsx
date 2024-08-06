import React, {
  type FC,
  type ComponentProps,
  useState,
  useEffect,
} from 'react';
import { Form, Spin } from '@douyinfe/semi-ui';
import type { CascaderData } from '@douyinfe/semi-ui/lib/es/cascader';
const FormCascader = Form.Cascader;

export type AsyncFormCascaderProps = ComponentProps<typeof Form.Cascader> & {
  fetchData: () => Promise<CascaderData[]>;
};

const AsyncFormCascader: FC<AsyncFormCascaderProps> = (props) => {
  const { fetchData, ...rest } = props;
  const [options, setOptions] = useState<CascaderData[]>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setOptions(undefined);
    fetchData()
      .then(setOptions)
      .finally(() => {
        setLoading(false);
      });
  }, [fetchData]);

  return (
    <FormCascader
      {...rest}
      emptyContent={
        loading ? (
          <Spin style={{ width: 80 }} tip="" />
        ) : (
          <div>
            暂无数据
          </div>
        )
      }
      placeholder="请选择工作项或模版"
      treeData={options}
    />
  );
};

export default AsyncFormCascader;
