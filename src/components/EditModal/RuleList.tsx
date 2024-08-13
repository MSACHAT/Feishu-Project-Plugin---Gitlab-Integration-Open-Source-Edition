/* eslint-disable unicorn/filename-case */
import React, { useContext, type FC } from 'react';
import {
  Row,
  Col,
  Divider,
  ArrayField,
  Button,
  Tooltip,
  Typography, Form,
} from '@douyinfe/semi-ui';
import RepositorySelect from './RepositorySelect';
import EventSelect from './EventSelect';
import {
  IconArrowRight,
  IconDelete,
  IconPlusCircle,
  IconInfoCircle,
} from '@douyinfe/semi-icons';
import NodesSelect from './NodesSelect';
import { ConfigContext } from '../../context/configContext';

interface IProps {
  values: Record<string, Array<string> | string | boolean>;
}

const {Text}=Typography;

const RuleList: FC<IProps> = () => {
  const { required } = useContext(ConfigContext);
  return (
    <ArrayField field='rules'>
      {({ add, arrayFields }) => (
        <React.Fragment>
          {arrayFields.map(({ field, key, remove }) => (
            <div key={key}>
              <Row gutter={8} type={'flex'} align={'middle'}>
                <Col span={14}>
                  <Row gutter={8} type={'flex'} align={'middle'}>
                    <Col>
                      {'当'}
                    </Col>
                    <Col span={10}>
                      <RepositorySelect field={`${field}[repo]`} />
                    </Col>
                    <Col>
                      {'的'}
                    </Col>
                    <Col span={10}>
                      {/* <MeegoInput field={'test'} /> */}
                      <EventSelect
                        placeholder={'请选择 GitLab 事件'}
                        field={`${field}[event]`}
                        style={{ width: '100%' }}
                        rules={[
                          {
                            //TODO:暂时写成false，记得调试完改回true
                            required: false,
                            message: '请选择 GitLab 事件',
                          },
                        ]}
                        noLabel
                        emptyContent={'暂无数据'}
                      />
                    </Col>
                    <Col>
                      {'时'}
                    </Col>
                    <Col>
                      <IconArrowRight style={{ marginTop: 4 }} />
                    </Col>
                  </Row>
                </Col>
                <Col span={10}>
                  <Row gutter={8} type={'flex'} align={'middle'}>
                    <Col span={required ? 14 : 20}>
                      <Row gutter={8} type={'flex'} align={'middle'}>
                        <Col span={20}>
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            {!required ? (
                              <Col>
                                {'到达'}
                              </Col>
                            ) : null}
                            <Col span={required ? 24 : 20}>
                              <NodesSelect
                                multiple
                                maxTagCount={1}
                                rules={[
                                  {
                                    required: true,
                                    message: required
                                      ? '请选择节点'
                                      : '请选择状态',
                                  },
                                ]}
                                style={{ width: '100%' }}
                                noLabel
                                placeholder={
                                  required
                                    ? '请选择节点'
                                    : '请选择状态'
                                }
                                field={`${field}[nodes]`}
                                emptyContent={'暂无数据'}
                              />
                            </Col>
                          </div>
                        </Col>
                        {required ? (
                          <Col>
                            {'完成'}
                          </Col>
                        ) : (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              marginLeft: 0,
                            }}
                          >
                            <Text>
                              {'状态'}
                            </Text>
                            <Tooltip
                              content={'为实现自动流转，请确保当前状态可进入该目标状态，且该过程中不涉及流转表单'}
                            >
                              <IconInfoCircle />
                            </Tooltip>
                          </div>
                        )}
                      </Row>
                    </Col>
                    <Col span={required ? 8 : 2}>
                      {
                        /*
                        TODO:这里用<Form.Switch/>代替了<MeegoFormSwitch/>，记得看看能不能跑
                         */
                      }
                      {required ? (
                        <Form.Switch
                          noLabel
                          field={`${field}[must]`}
                        ></Form.Switch>
                      ) : null}
                    </Col>
                    <Col span={2}>
                      <IconDelete
                        style={{ cursor: 'pointer' }}
                        onClick={remove}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Divider style={{ margin: '12px 0' }} />
            </div>
          ))}
          <Button
            onClick={add}
            icon={<IconPlusCircle />}
            type='primary'
            theme='borderless'
          >
            {'添加节点映射'}
          </Button>
        </React.Fragment>
      )}
    </ArrayField>
  );
};

export default RuleList;
