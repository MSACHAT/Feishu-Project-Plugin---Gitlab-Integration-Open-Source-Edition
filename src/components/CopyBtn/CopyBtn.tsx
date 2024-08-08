import React, { useEffect, useState } from 'react';
import { IconCopy } from '@douyinfe/semi-icons';
import { Tooltip, Button, Toast } from '@douyinfe/semi-ui';
import { fetchSignature } from '../../api/service';
import { copyText } from '../../utils';
import useSdkContext from '../../hooks/useSdkContext';
import { requestHost } from '../../constants';

export default function CopyBtn() {
  const context = useSdkContext();
  const mainSpace = context?.mainSpace;
  const spaceId = mainSpace?.id ?? '';
  const [signature, setSignature] = useState<string | null>(null);
  useEffect(() => {
    fetchSignature(spaceId).then((res) => {
      if (res?.data?.signature) {
        setSignature(res.data.signature);
      }
    });
  }, []);

  return (
    <Tooltip
      content='用于配置 Gitlab Webhook 的 URL 和 token，详见规则配置页的帮助文档'
      position='bottom'
      showArrow={false}
    >
      <Button
        icon={<IconCopy style={{ fill: 'white' }} />}
        theme='solid'
        onClick={async () => {
          if (signature) {
            copyText(requestHost + `/webhook?=${signature}`);
          } else {
            setSignature(null);

            Toast.error({ content: '获取 token 失败' });
          }
        }}
      >
        '复制 URL'
      </Button>
    </Tooltip>
  );
}
