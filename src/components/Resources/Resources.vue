<template>
    <Row>
        <Row type="flex" justify="start" style="margin:0 0px 10px;">
            <ButtonGroup>
                <Button type="primary" icon="plus-round" @click="editResources('add')">新增资源</Button>
                <Button icon="close-round" @click="editResources('del')">删除资源</Button>
            </ButtonGroup>
        </Row>
        <Table height="600" size="small" border :columns="columns" :data="resourcesdata" @on-selection-change="selectResources" @on-select-cancel="selectResources">
        </Table>

        <Modal v-model="addResourcesModal" :title="isResourcesEdit?'修改资源':'新增资源'" :loading="btnloading" @on-ok="saveResources" :mask-closable="false" :closable="false">
            <Form ref="formValidate" :rules="ruleValidate" :model="Resourcesform" label-position="right" :label-width="100">
                <FormItem label="菜单类型：">
                    <RadioGroup v-model="Resourcesform.ResourceType" type="button">
                        <Radio style="width:120px;text-align:center;" label="目录" :disabled="isResourcesEdit && Resourcesform.ResourceType=='资源'"></Radio>
                        <Radio style="width:120px;text-align:center;" label="资源" :disabled="isResourcesEdit && Resourcesform.ResourceType=='目录'"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="资源名称：" prop="ResourceName">
                    <Input v-model="Resourcesform.ResourceName" placeholder="请输入资源名称"></Input>
                </FormItem>
                <FormItem label="资源URL：" v-if="Resourcesform.ResourceType=='资源'" prop="ResourceUrl">
                    <Input v-model="Resourcesform.ResourceUrl" placeholder="请输入资源URL"></Input>
                </FormItem>
                <FormItem label="父级目录：" v-if="Resourcesform.ResourceType=='资源'" prop="ParentID">
                    <Select v-model="Resourcesform.ParentID" filterable placeholder="请选择父级目录">
                        <Option v-for="item in resourcesdata" :value="item.Id.toString()" :key="item.Id">{{ item.ResourceName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="是否启用：">
                    <Checkbox v-model="Resourcesform.IsEnable">
                    </Checkbox>
                </FormItem>
                <FormItem label="是否分配权限：">
                    <Checkbox v-model="Resourcesform.IsTopermission">
                    </Checkbox>
                </FormItem>
            </Form>
        </Modal>
    </Row>
</template>

<script>
import expandRow from './table-expand.vue';
export default {
    components: { expandRow },
    beforeMount() {
        this.loadResources(0);
    },

    data() {
        return {
            btnloading: true,
            addResourcesModal: false,
            Resourcesform: {
                Id: 0,
                ResourceType: '目录',
                ParentID: 0,
                ResourceName: '',
                ResourceUrl: '',
                IsEnable: true,
                IsTopermission: false
            },
            columns: [{
                type: 'selection',
                width: '40px',
                align: 'center'
            }, {
                type: 'expand',
                width: 50,
                render: (h, params) => {
                    return h(expandRow, {
                        props: {
                            row: params.row,
                            editFun: this.editResources,
                            subselect: this.subselect
                        }
                    })
                }
            }, {
                title: '序号',
                key: 'rownum',
                render: (h, params) => {
                    return h('strong', params.index + 1);
                },
                align: 'center',
                width: '70px'
            },
            {
                key: 'ResourceName',
                title: '资源名称',
                align: 'center',
            },
            {
                key: 'ResourceType',
                title: '资源类型',
                align: 'center',
            }, {
                key: 'IsEnable',
                title: '状态',
                width: '70px',
                render: (h, params) => {
                    return h('span', params.row.IsEnable && '启用' || '禁用');
                },
                align: 'center',
            },
            {
                key: 'Creator',
                title: '创建人',
                align: 'center',
                width: '100px'
            },
            {
                key: 'CreateTime',
                title: '创建时间',
                render: (h, params) => {
                    return h('span', this.$moment(params.row.CreateTime).format('YYYY-MM-DD HH:mm'));
                },
                align: 'center',
            },
            {
                title: '操作',
                key: 'operation',
                align: 'center',
                render: (h, params) => {
                    return h('Button', {
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.editResources('edit', params.row)
                            }
                        }
                    }, '设置')
                }
            }
            ],
            resourcesdata: [],
            isResourcesEdit: false,
            selectResourceslist: [],
            subselectId: [],
            ruleValidate: {
                ResourceName: [
                    { required: true, message: '该内容不允许为空', trigger: 'blur' }
                ],
                ResourceUrl: [
                    { required: true, message: '该内容不允许为空', trigger: 'blur' }
                ],
                ParentID: [
                    { required: true, message: '该内容不允许为空', trigger: 'change' }
                ],
            }
        }
    },

    methods: {
        loadResources() {
            this.$getServerData('RoleMgr/getResource', {}, data => {
                this.resourcesdata = data.datalist;
            });
        },
        editResources(type, row) {
            if (type == 'add') {
                this.addResourcesModal = true;
                this.isResourcesEdit = false;
                this.Resourcesform = {
                    Id: 0,
                    ResourceType: '目录',
                    ParentID: 0,
                    ResourceName: '',
                    ResourceUrl: '',
                    IsEnable: true,
                    IsTopermission: false
                }
            }
            else if (type == 'edit') {
                this.addResourcesModal = true;
                this.isResourcesEdit = true;
                this.Resourcesform = JSON.parse(JSON.stringify(row));;
                this.Resourcesform.ParentID = row.ParentID.toString();
                this.Resourcesform.ResourceType = (row.ResourceType == 1 || row.ResourceType == '目录') ? '目录' : '资源';
            }
            else if (type == 'del') {
                let resourcesname = [];
                this.subselectId.map(x => {
                    x.map(k => {
                        resourcesname.push({
                            ResourceName: k.ResourceName,
                            Id: k.Id,
                            ParentID: k.ParentID
                        });
                    });
                }
                ).join(',');

                if (resourcesname.length == 0 && this.selectResourceslist.length == 0) {
                    this.$Message.warning('请选择相应的菜单删除！');
                    return;
                }

                var pidlist = this.selectResourceslist.map(x => x.Id);

                this.$Modal.confirm({
                    title: '确认是否删除以下菜单？',
                    content: '<div style="font-size:14px;color:#F44336">' + this.selectResourceslist.map(x => {
                        return ('<p>' + x.ResourceName + '</p>') + resourcesname.filter(k => k.ParentID == x.Id).map(p => ('<p>&nbsp;&nbsp; ↳' + p.ResourceName + '</p>')).join('');
                    }
                    ).join('') + '<p>-------</p>' + resourcesname.filter(k => pidlist.indexOf(k.ParentID) == -1).map(p => ('<p>&nbsp;&nbsp; ↳' + p.ResourceName + '</p>')).join('') + '</div>',
                    onOk: () => {
                        let idlist = resourcesname.map(x => x.Id).concat(pidlist);
                        this.$getServerData('ResourceMgr/del', {
                            ids: idlist
                        }, data => {
                            this.loadResources();
                            this.$Message.success('操作成功！');
                        });
                    },
                });
            }
        },
        saveResources() {
            let posejson = {
                id: this.Resourcesform.Id,
                resourcetype: this.Resourcesform.ResourceType == '目录' ? 1 : 0,
                parentid: 0,
                resourcename: this.Resourcesform.ResourceName,
                isenable: this.Resourcesform.IsEnable,
                istopermission: this.Resourcesform.IsTopermission,
            };
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    if (posejson.resourcetype == 0) {
                        posejson.parentid = this.Resourcesform.ParentID;
                        posejson.resourceurl = this.Resourcesform.ResourceUrl;
                    }
                    this.$getServerData('ResourceMgr/addOrUpRs', posejson, data => {
                        this.loadResources();
                        this.$Message.success('操作成功！');
                        this.addResourcesModal = false;
                    });
                } else {
                    this.$Message.warning('请录入完整信息');
                    this.btnloading = false;
                    setTimeout(() => {
                        this.btnloading = true;
                    }, 100);
                    return;
                }
            })
            // if (posejson.resourcetype == 0) {
            //     posejson.parentid = this.Resourcesform.ParentID;
            //     posejson.resourceurl = this.Resourcesform.ResourceUrl;
            //     if (!posejson.parentid || !posejson.resourcename || !posejson.resourceurl) {
            //         this.$Message.warning('请录入完整信息');
            //         this.btnloading = false;
            //         setTimeout(() => {
            //             this.btnloading = true;
            //         }, 100);
            //         return;
            //     }
            // }
            // if (!posejson.resourcename) {
            //     this.$Message.warning('请录入完整信息');
            //     this.btnloading = false;
            //     setTimeout(() => {
            //         this.btnloading = true;
            //     }, 100);
            //     return;
            // }
        },
        selectResources(sel) {
            this.selectResourceslist = sel;
        },
        subselect(pid, row, type) {
            if (type == 'select') {
                this.subselectId[pid] = row;
            }
        },
    }
}
</script>
 