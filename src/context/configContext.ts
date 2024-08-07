import React from 'react';
import type { GithubEventList, IConfigList, IRepos, IWorkItem } from '../api/types';

interface INodes {
  label: string;
  value: string;
}

interface IContext {
  workItem: Array<IWorkItem>;
  setWorkItem: React.Dispatch<React.SetStateAction<Array<IWorkItem>>>;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  repositories: Array<IRepos>;
  setRepos: React.Dispatch<React.SetStateAction<Array<IRepos>>>;
  eventList: Array<GithubEventList>;
  setEventList: React.Dispatch<React.SetStateAction<Array<GithubEventList>>>;
  nodes: Array<INodes>;
  setNodes: React.Dispatch<React.SetStateAction<Array<INodes>>>;
  editInfo: IConfigList | null;
  setEditInfo: React.Dispatch<React.SetStateAction<IConfigList | null>>;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  updateFlag: number;
  setUpdateFlag: React.Dispatch<React.SetStateAction<number>>;
  required: boolean;
  setRequired: React.Dispatch<React.SetStateAction<boolean>>;
  modalLoading: boolean;
  setModalLoading: React.Dispatch<React.SetStateAction<boolean>>;
  templateList: Array<string>;
  setTemplateList: React.Dispatch<React.SetStateAction<Array<string>>>;
  modalBtnLoading: boolean;
  setModalBtnLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const defValue: IContext = {
  workItem: [],
  setWorkItem: (e: Array<IWorkItem>) => e,
  isEdit: false,
  setIsEdit: (e: boolean) => e,
  repositories: [],
  setRepos: (e: Array<IRepos>) => e,
  eventList: [],
  setEventList: (e: Array<GithubEventList>) => e,
  nodes: [],
  setNodes: (e: Array<INodes>) => e,
  editInfo: null,
  setEditInfo: (e: IConfigList | null) => e,
  visible: false,
  setVisible: (e: boolean) => e,
  updateFlag: 0,
  setUpdateFlag: (e: number) => e,
  required: true,
  setRequired: (e: boolean) => e,
  modalLoading: false,
  setModalLoading: (e: boolean) => e,
  templateList: [],
  setTemplateList: (e: Array<string>) => e,
  modalBtnLoading: false,
  setModalBtnLoading: (e: boolean) => e,
};

export const ConfigContext = React.createContext(defValue);
