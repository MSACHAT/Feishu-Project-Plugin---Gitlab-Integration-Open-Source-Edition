import React, {
  type FC,
  type ComponentProps,
  useState,
  useEffect,
} from 'react';
import { Select } from '@douyinfe/semi-ui';
import type { OptionProps } from '@douyinfe/semi-ui/lib/es/select';
import type { Form } from '@douyinfe/semi-ui';

export type AsyncFormSelectProps = ComponentProps<typeof Form.Select> & {
  fetchData: () => Promise<OptionProps[]>;
};

const AsyncFormSelect: FC<AsyncFormSelectProps> = (props) => {
  const { fetchData, ...rest } = props;
  const [options, setOptions] = useState<OptionProps[]>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setOptions(undefined);
    fetchData()
      .then(setOptions)
        //由于.finally()失效了，这里用.then()代替
      .then(() => {
        setLoading(false);
      });
  }, [fetchData]);

  return <Select {...rest} loading={loading} optionList={options} />;
};

export default AsyncFormSelect;
