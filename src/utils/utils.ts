import { OutOfLimitError } from '@lark-project/js-sdk';

import { sdkManager } from './sdk';

export async function copyText(text: string) {
  const sdk = await sdkManager.getSdkInstance();
  try {
    const success = await sdk.clipboard.writeText(text);
    if (success) {
      sdk.toast.success('复制成功');
    } else {
      sdk.toast.warning('当前浏览器不支持复制');
    }
  } catch (error) {
    if (error.name === OutOfLimitError.name) {
      sdk.toast.error(error.originMessage);
    } else {
      sdk.toast.error('复制失败');
    }
  }
}

export const getHref = async () => {
  const sdk = await sdkManager.getSdkInstance();
  const href = await sdk.navigation.getHref();
  return new URL(href);
};

export const getHelpDocumentHref = async () => {
  return 'https://project.feishu.cn/b/helpcenter/1ykiuvvj/5svra4v1';
};

export const getFlowMode = async (params: { spaceId: string; workObjectId: string }) => {
  const sdk = await sdkManager.getSdkInstance();
  const workObj = await sdk.WorkObject.load(params);
  return workObj.flowMode;
};

export const getSpace = async (projectKey: string) => {
  const sdk = await sdkManager.getSdkInstance();
  return sdk.Space.load(projectKey);
};
