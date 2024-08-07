import request from './requests'
import {
  GithubEventList,
  ICommonSetting,
  IConfigList,
  INodes,
  IRelevances,
  IRepos,
  IRepositories,
  ResponseWrap,
  TemplateInfo,
} from './types';


export const fetchApprovalList = (
  project_key: string,
  workitem_key: string,
  template_id: string | number,
) =>
  request.get<unknown, ResponseWrap<{ data: GithubEventList }>>(
    '/m-api/v1/builtin_app/gitlab/events',
    { params: { project_key, workitem_key, template_id } },
  );

// 获取节点
export const fetchFlowNodes = (projectKey: string, templateId: string) =>
  request.post<INodes>('/m-api/v1/builtin_app/common_api/query_template_detail?app_type=gitlab', {
    project_key: projectKey,
    template_id: Number(templateId) || 0,
  });

// 获取模版列表
export const fetchTemplateList = (projectKey: string, workItemKey: string) =>
  request.post<TemplateInfo[]>('/m-api/v1/builtin_app/common_api/query_templates?app_type=gitlab', {
    project_key: projectKey,
    work_item_type_key: workItemKey,
  });

// 获取规则列表
export const fetchConfigList = (project_key: string) =>
  request
    .get<
      unknown,
      ResponseWrap<{
        data: Array<IConfigList>;
      }>
    >(`/m-api/v1/builtin_app/gitlab/${project_key}/config`)
    .then(res => res.data);

// 获取签名用于配置webhook
export const fetchSignature = (project_key: string) =>
  request
    .get<
      unknown,
      ResponseWrap<{
        code: number;
        data: {
          signature: string;
        };
      }>
    >(`/config/${project_key}/setting`)
    .then(res => res.data);

// 添加仓库
export const fetchAddRepo = (project_key: string, repositories: Array<IRepositories>) =>
  request.post<unknown, ResponseWrap<string>>(` /config/${project_key}/repository`, {
    repositories,
  });

// 删除仓库
export const fetchDelRepo = (project_key: string, repoName: string) =>
  request.delete<unknown, ResponseWrap<string>>(` /config/${project_key}/repository`, {
    params: { path_with_namespace: repoName },
      headers:{
        "Content-Type":"application/x-www-form-urlencoded"
      }
  });

// 添加规则
export const fetchAddRules = rule =>
  request.post<unknown, ResponseWrap<any>>('/m-api/v1/builtin_app/gitlab/config', { rule });

// 解除绑定
export const fetchUnbind = (project_key: string, work_item_id: string, id: string) =>
  request.post<unknown, ResponseWrap<string>>('/m-api/v1/builtin_app/gitlab/work_item/unbind', {
    project_key,
    work_item_id,
    id,
  });

// 获取仓库列表
export const fetchReposList = (project_key: string) =>
  request.get<
    unknown,
    ResponseWrap<{
      repositories: Array<IRepos>;
    }>
  >(`/config/${project_key}/repository`);

// 插件可见性
export const fetPluginVisible = (
  work_item_id: string,
  project_key: string,
  work_item_type_key: string,
) =>
  request.get<
    unknown,
    ResponseWrap<{
      is_visible: boolean;
    }>
  >('/m-api/v1/builtin_app/gitlab/visible', {
    params: { work_item_id, project_key, work_item_type_key },
  });

// 获取绑定信息
export const fetchRelevances = (project_key: string, workitem_id: string) =>
  request.get<unknown, ResponseWrap<IRelevances>>(
    '/m-api/v1/builtin_app/gitlab/work_item/relevance',
    {
      params: { project_key, workitem_id },
    },
  );

// 删除规则
export const fetchDelRule = (id: string, project_key: string) =>
  request.delete<unknown, ResponseWrap<any>>(
    `/m-api/v1/builtin_app/gitlab/config/${id}?project_key=${project_key}`,
  );

// 自定义流转规则
export const commonSetting = (
  project_key: string,
  settings: {
    link_rule: string;
    trigger_key_words: string;
  },
  name = '',
  setting_type = 1,
) =>
  request.post<unknown, ResponseWrap<any>>('/config/config', {
    project_key,
    settings: JSON.stringify(settings),
    name,
    setting_type,
  });

// 获取自定义流转规则
export const getCommonSetting = (project_key: string) =>
  request.get<unknown, ResponseWrap<ICommonSetting>>(`/config/${project_key}/config`);

export function getBindings(params) {
  return request.get(
    `/m-api/v1/builtin_app/gitlab/${params.project_key}/${params.workitem_id}/binding`,
  );
}

export function deleteBindings(params) {
  return request.delete(
    `/m-api/v1/builtin_app/gitlab/${params.project_key}/${params.workitem_id}/binding`,
    {
      params: { id: params.id },
    },
  );
}

export function isVisible(params) {
  return request.get(`/m-api/v1/builtin_app/gitlab/visible`, {
    params: params,
  });
}

export function enableRule(id, enable) {
  return request.post(`/m-api/v1/builtin_app/gitlab/config/enable/${id}/${enable}`);
}