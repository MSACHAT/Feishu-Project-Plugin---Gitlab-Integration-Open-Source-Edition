import React, { useEffect, useState } from 'react';
import { IconCopy } from '@douyinfe/semi-icons';
import { Tooltip, Button, Toast } from '@douyinfe/semi-ui';
import { fetchSignature } from '../../api/service';
import { copyText } from '../../utils';
import { requestHost } from '../../constants';

export default function CopyBtn() {
  const [signature, setSignature] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const context = await window.JSSDK.Context.load()
      const spaceId = context.mainSpace?.id
      fetchSignature(spaceId||"").then((res) => {
        //TODO:流氓类型改掉
        const result=res as unknown as {callback:string}
        if (result.callback) {
          setSignature(result.callback);
        }
      });
    })()
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
            await copyText(requestHost + `/webhook?=${signature}`);
          } else {
            setSignature(null);

            Toast.error({ content: '获取 token 失败' });
          }
        }}
      >
        复制 URL
      </Button>
    </Tooltip>
  );
}
