import request from './requests'
import type {
  GithubEventList,
  ICommonSetting,
  IConfigList,
  INodes,
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
    `/common_api/projects/${project_key}/work_item_types`,
  );
// 获取节点
export const fetchFlowNodes = (projectKey?: string, templateId?: string) =>
  request.post<INodes>('/common_api/query_template_detail', {
    project_key: projectKey,
    template_id: Number(templateId) || 0,
  });

// 获取模版列表
export const fetchTemplateList = (projectKey?: string, workItemKey?: string) =>
  request.post<TemplateInfo[]>('/common_api/query_templates', {
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
    >(`/config/${project_key}/config`)
    .then(res => res.data);

// 获取签名用于配置webhook
export const fetchSignature = (project_key: string) =>
  request
    .get<
      unknown,
      ResponseWrap<{

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
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

// 添加规则
export const fetchAddRules = rule =>
  request.post<unknown, ResponseWrap<any>>('/config/config', { rule });

// 获取仓库列表
export const fetchReposList = (project_key: string) =>
  request.get<
    unknown,
    ResponseWrap<{
      repositories: Array<IRepos>;
    }>
  >(`/config/${project_key}/repository`);

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

export function getBindings({ project_key, workitem_id }) {
    return request.get(`/binding/${project_key}/${workitem_id}/binding`,{headers:{
        "Content-Type":"application/x-www-form-urlencoded"
        }});
}

export function deleteBindings({ project_key, workitem_id, id }) {
  return request.delete(`/binding/${project_key}/${workitem_id}/binding`, {
    params: { id: id },
  });
}


export function enableRule(id, enable) {
  return request.post(`/config/enable/${id}/${enable}`, {}, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}