import React, { useCallback, useContext, type FC } from 'react';
import { ConfigContext } from '../../context/configContext';
import type { AsyncFormSelectProps } from '../AsyncFormSelect/AsyncFormSelect';
import AsyncFormSelect from '../AsyncFormSelect/AsyncFormSelect';

type Props = Omit<AsyncFormSelectProps, 'fetchData'>;

const NodesSelect: FC<Props> = (props) => {
  const { ...rest } = props;
  const { nodes } = useContext(ConfigContext);
  const fetchNodesList = useCallback(async () => nodes || [], [nodes]);

  return <AsyncFormSelect {...rest} fetchData={fetchNodesList} />;
};

export default NodesSelect;
