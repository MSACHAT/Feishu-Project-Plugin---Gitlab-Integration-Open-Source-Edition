import React, { useCallback, useContext, type FC } from 'react';
import { ConfigContext } from '../../context/configContext';
import type { AsyncFormSelectProps } from '../AsyncFormSelect/AsyncFormSelect';
import AsyncFormSelect from '../AsyncFormSelect/AsyncFormSelect';

type Props = Omit<AsyncFormSelectProps, 'fetchData'>;

const EventSelect: FC<Props> = (props) => {
  const { ...rest } = props;
  const { eventList } = useContext(ConfigContext);

  const fetchEventList = useCallback(
    async () =>
      eventList.map((item) => ({
        label: item.name,
        value: item.key,
      })),
    [eventList],
  );

  return <AsyncFormSelect {...rest} fetchData={fetchEventList} />;
};

export default EventSelect;
