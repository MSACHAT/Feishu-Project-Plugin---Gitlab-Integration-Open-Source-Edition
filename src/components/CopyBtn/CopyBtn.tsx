import React, { useEffect, useState } from 'react';
import { IconCopy } from '@douyinfe/semi-icons';
import { Tooltip, Button, Toast } from '@douyinfe/semi-ui';
import { fetchCallbackUrl } from '../../api/service';
import { copyText } from '../../utils';

export default function CopyBtn() {
  const [signature, setSignature] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const context = await window.JSSDK.Context.load();
        const spaceId = context.mainSpace?.id;
        console.log('spaceId', spaceId);

        const res = await fetchCallbackUrl(spaceId || '');
        const result = res as unknown as { callback: string };
        if (result.callback) {
          setSignature(result.callback);
        } else {
          Toast.error({ content: '获取签名失败' });
        }
      } catch (error) {
        console.error('Error fetching callback URL:', error);
        Toast.error({ content: '获取回调 URL 失败' });
      }
    })();
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
          console.error('signature', signature);
          if (signature) {
            try {
              await copyText(signature);
              Toast.success({ content: '复制成功' });
            } catch (error) {
              Toast.error({ content: '复制失败' });
            }
          } else {
            Toast.error({ content: '获取 token 失败' });
          }
        }}
      >
        复制 URL
      </Button>
    </Tooltip>
  );
}
