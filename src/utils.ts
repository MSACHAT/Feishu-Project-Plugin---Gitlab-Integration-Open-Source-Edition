import { OutOfLimitError } from '@lark-project/js-sdk';

const sdk = window.JSSDK;

export async function copyText(text: string) {

  try {
    await sdk.clipboard.writeText(text);

    sdk.toast.success('复制成功');

  } catch (error) {

    if (error.name === OutOfLimitError.name) {
      sdk.toast.error(error.originMessage);
    } else {
      sdk.toast.error('复制失败');
    }
  }
}

export const getHref = async () => {

  const href = await sdk.navigation.getHref();
  return new URL(href);
};

export const getHelpDocumentHref = async () => {
  return 'https://project.feishu.cn/b/helpcenter/1ykiuvvj/5svra4v1';
};

export const getFlowMode = async (params: { spaceId: string; workObjectId: string }) => {

  const workObj = await sdk.WorkObject.load(params);
  return workObj.flowMode;
};

export const getSpace = async (projectKey: string) => {

  return sdk.Space.load(projectKey);
};
