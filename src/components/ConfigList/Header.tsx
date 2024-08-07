import React, { type ReactNode, type FC } from 'react';
import { Button, Typography, Layout } from '@douyinfe/semi-ui';
import { IconPlusCircle } from '@douyinfe/semi-icons';
import type { ButtonProps } from '@douyinfe/semi-ui/lib/es/button';

const {Title} = Typography;
//重命名为SemiHeader防止冲突
const { Header: SemiHeader } = Layout;

const Header: FC<{
  title: string;
  onClickAdd: ButtonProps['onClick'];
  addBtnText?: string;
  headerContent?: ReactNode;
}> = (props) => {
  const { title, onClickAdd, addBtnText, headerContent } = props;

  return (
    <SemiHeader style={{ display: 'flex', padding: '12px 24px' }}>
      <Title heading={5} style={{ flex: 1 }}>
        {title}
      </Title>
      <>{headerContent || null}</>
      <Button icon={<IconPlusCircle />} theme="solid" onClick={onClickAdd}>
        {addBtnText || '添加规则'}
      </Button>
    </SemiHeader>
  );
};

export default Header;
