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
    const fetchDataAndSetOptions = async () => {
      setLoading(true);
      setOptions(undefined);
      try {
        const data = await fetchData();
        setOptions(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndSetOptions();
  }, [fetchData]);

  return <Select {...rest} loading={loading} optionList={options} />;
};

export default AsyncFormSelect;
