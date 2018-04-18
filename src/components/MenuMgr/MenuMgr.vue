<style>
#project_list {
    max-height: 600px;
    overflow-y: auto;
}

#project_list .ivu-menu-item {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

#project_list .ivu-menu-item-active.ivu-menu-item-selected {
    background: #dce6f1;
}

#project_list .ivu-table-expanded-cell {
    background-color: #d8d8d8 !important;
}

#project_set .ivu-dropdown-menu {
    padding: 10 16px；
}

#btnTable .ivu-table-row-highlight td {
    background-color: #ddd;
}
</style>
<template>
    <Row>
        <Col span="3">
        <Row type="flex" justify="start" style="margin:0px 0px 10px;">
            <div v-if="editProject">
                <Button type="error" @click="()=>{ this.editProject=false }">完成</Button>
            </div>
            <div v-else>
                <Dropdown trigger="click" transfer placement="bottom-start" @on-click="projectcase">
                    <Button>
                        <Icon type="ios-settings-strong"></Icon>
                    </Button>
                    <DropdownMenu slot="list" id="project_set">
                        <DropdownItem name="add">
                            <Icon type="plus-round"></Icon>
                            <span style="margin-left:5px;">创建项目</span>
                        </DropdownItem>
                        <DropdownItem name="edit">
                            <Icon type="wrench"></Icon>
                            <span style="margin-left:5px;">修改项目</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>

        </Row>

        <Menu id="project_list" ref="side_menu" width="auto" :active-name="defaultProject" @on-select="selectProject">
            <template v-for="item in projectdata">
                <MenuItem :name="item.Id" :key="item.Id" :title="item.ProjectRemark"> {{ item.ProjectName }}
                <div style="float:right" v-if="editProject">
                    <a href="javascript:void(0)" @click="editProjectFun('edit',item)" @click.stop>
                        <Icon type="edit"></Icon>
                    </a>
                    <a href="javascript:void(0)" @click="editProjectFun('del',item)" @click.stop>
                        <Icon type="close-round" color="red"></Icon>
                        </Icon>
                    </a>
                </div>
                </MenuItem>
            </template>
        </Menu>
        </Col>
        <Col span="21">
        <Row type="flex" justify="start" style="margin:0 0px 10px;">
            <ButtonGroup>
                <Button type="primary" icon="plus-round" @click="addMenu">新增菜单</Button>
                <Button icon="close-round" @click="delMenu">删除菜单</Button>
            </ButtonGroup>
        </Row>
        <Table height="600" size="small" border :columns="columns" :data="projectMenudata" @on-selection-change="selectMenu" @on-select-cancel="selectMenu">
        </Table>
        </Col>
        <Modal v-model="addProjectModal" title="创建项目" :loading="btnloading" @on-ok="saveProject" :mask-closable="false" :closable="false">
            <Form ref="formValidate_Project" :rules="ruleValidate" :model="createProjectform" label-position="right" :label-width="100">
                <FormItem label="项目名称：" prop="projectname">
                    <Input v-model="createProjectform.projectname" placeholder="请输入项目名称"></Input>
                </FormItem>
                <FormItem label="项目描述：">
                    <Input v-model="createProjectform.projectremark" placeholder="请输入项目描述"></Input>
                </FormItem>
                <!--<FormItem label="项目Key：">
                                                                                                                           <Input v-model="createProjectform.projectkey" placeholder="请输入项目Key"></Input>                                                                                              </FormItem>-->
            </Form>
        </Modal>

        <Modal v-model="addMenuModal" :title="(!createMenuform.edit1 && !createMenuform.edit2)?'新增菜单':'修改菜单'" :loading="btnloading" @on-ok="saveMenu" :mask-closable="false" :closable="false">
            <Form ref="formValidate_Menu" :rules="ruleValidate" :model="createMenuform" label-position="right" :label-width="100">
                <FormItem label="菜单类型：">
                    <RadioGroup v-model="createMenuform.Type" type="button">
                        <Radio style="width:120px;text-align:center;" label="目录" :disabled="createMenuform.edit1"></Radio>
                        <Radio style="width:120px;text-align:center;" label="菜单" :disabled="createMenuform.edit2"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="菜单名称：" prop="MenuName">
                    <Input v-model="createMenuform.MenuName" placeholder="请输入菜单名称"></Input>
                </FormItem>
                <FormItem label="菜单URL：" v-if="createMenuform.Type=='菜单'" prop="MenuUrl">
                    <Input v-model="createMenuform.MenuUrl" placeholder="请输入菜单URL"></Input>
                </FormItem>
                <FormItem label="父级目录：" v-if="createMenuform.Type=='菜单'" prop="MenuPrentMenu">
                    <Select v-model="createMenuform.MenuPrentMenu" filterable>
                        <Option v-for="item in projectMenudata" :value="item.Id.toString()" :key="item.Id">{{ item.MenuName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="是否启用：">
                    <Checkbox v-model="createMenuform.Isenable">
                    </Checkbox>
                </FormItem>
                <FormItem label="优先级：">
                    <InputNumber v-model="createMenuform.Priority" :editable="false"></InputNumber>
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
        this.loadMenu();
        let user=this.$route;
        console.log(user);
    },

    data() {
        return {
            columns: [
                {
                    type: 'selection',
                    width: 40,
                    align: 'center'
                }, {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(expandRow, {
                            props: {
                                row: params.row,
                                editMenuModal: this.editMenu,
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
                    title: '目录名称',
                    key: 'MenuName',
                    align: 'center',
                },
                {
                    title: '优先级',
                    key: 'Priority',
                    align: 'center',
                },
                {
                    title: '是否启用',
                    key: 'IsEnable',
                    align: 'center',
                    render: (h, params) => {
                        return h('span', (params.row.IsEnable && '是' || '否'));
                    },
                },
                {
                    title: '创建时间',
                    key: 'CreateTime',
                    align: 'center',
                    render: (h, params) => {
                        return h('span', this.$moment(params.row.CreateTime).format('YYYY-MM-DD HH:mm'));
                    },
                },
                {
                    title: '创建人',
                    key: 'Creator',
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
                                    this.editMenu(0, params.row)
                                }
                            }
                        }, '设置')
                    }
                }
            ],
            defaultProject: 1,
            projectMenudata: [],
            projectdata: [],
            addProjectModal: false,
            btnloading: true,
            createProjectform: {
                projectname: '',
                projectremark: '',
                projectkey: ''
            },
            addMenuModal: false,
            selectMenulist: [],
            createMenuform: {
                Type: '目录',
                MenuName: '',
                MenuUrl: '',
                MenuPrentMenu: 0,
                Isenable: true,
                Priority: 1,
                edit1: false,
                edit2: false,
                Mid: 0
            },
            subselectId: [],
            editProject: false,
            ruleValidate: {
                projectname: [
                    { required: true, message: '该内容不允许为空', trigger: 'blur' }
                ],
                MenuName: [
                    { required: true, message: '该内容不允许为空', trigger: 'blur' }
                ],
                MenuUrl: [
                    { required: true, message: '该内容不允许为空', trigger: 'blur' }
                ],
                MenuPrentMenu: [
                    { required: true, message: '该内容不允许为空', trigger: 'change' }
                ],
            }
        }
    },
    methods: {
        getProjectMenulist(key) {
            this.$getServerData('MenuMgr/getMenulist', {
                projectid: key
            }, data => {
                this.projectMenudata = data.datalist;
            });
        },
        getProjectlist(func) {
            this.$getServerData('Project/getProjectlist', {}, data => {
                if (data.datalist.length == 0) {
                    return;
                }
                this.projectdata = data.datalist;
                this.defaultProject = data.datalist[0].Id;
                this.getProjectMenulist(data.datalist[0].Id)
                if (func) {
                    func(data.datalist);
                }
            });
        },
        selectProject(Id) {
            this.defaultProject = Id;
            this.getProjectMenulist(Id)
        },
        projectcase(name) {
            if (name === 'add') {
                this.addProjectModal = true;
            }
            else if (name === 'edit') {
                this.editProject = true;
            }
        },
        loadMenu() {
            this.getProjectlist(() => {
                this.$nextTick(() => {
                    this.$refs.side_menu.updateActiveName();
                });
            });
        },
        saveProject() {
            this.$refs.formValidate_Project.validate((valid) => {
                if (valid) {
                    let pjName = this.createProjectform.projectname;
                    let pjRemark = this.createProjectform.projectremark;
                    // let pjKey = this.createProjectform.projectkey;
                    this.$getServerData('Project/addOrUpProject', {
                        id: 0,
                        projectname: pjName,
                        projectremark: pjRemark,
                        // projectkey: pjKey,
                    }, data => {
                        this.loadMenu();
                        this.addProjectModal = false;
                        this.$Message.success('添加成功！');
                    });
                } else {
                    this.$Message.warning('请录入完整信息');
                    this.btnloading = false;
                    setTimeout(() => {
                        this.btnloading = true;
                    }, 100);
                    return;
                }
            });
        },
        addMenu() {
            this.createMenuform = {
                Type: '目录',
                MenuName: '',
                MenuUrl: '',
                MenuPrentMenu: 0,
                Isenable: true,
                Priority: 1,
                edit1: false,
                edit2: false
            };
            this.addMenuModal = true;
        },
        editMenu(type, row) {
            if (type == 0) {
                this.createMenuform.Type = '目录';
                this.createMenuform.edit1 = false;
                this.createMenuform.edit2 = true;
            }
            else if (type == 1) {
                this.createMenuform.Type = '菜单';
                this.createMenuform.MenuUrl = row.MenuUrl;
                this.createMenuform.MenuPrentMenu = row.ParentID.toString();
                this.createMenuform.edit1 = true;
                this.createMenuform.edit2 = false;
            }
            this.createMenuform.MenuName = row.MenuName;
            this.createMenuform.Isenable = row.IsEnable;
            this.createMenuform.Priority = row.Priority;
            this.createMenuform.Mid = row.Id;
            this.addMenuModal = true;
        },
        saveMenu() {
            this.$refs.formValidate_Menu.validate((valid) => {
                if (valid) {
                    let projectid = this.defaultProject;
                    let parentid = this.createMenuform.MenuPrentMenu;
                    let menuname = this.createMenuform.MenuName;
                    let isenable = this.createMenuform.Isenable;
                    let priority = this.createMenuform.Priority;
                    let postdata = {};
                    if (parentid == 0) {
                        postdata = {
                            projectid: projectid,
                            parentid: 0,
                            menuname: menuname,
                            isenable: isenable,
                            priority: priority
                        };
                    }
                    else {
                        postdata = {
                            projectid: projectid,
                            menuurl: this.createMenuform.MenuUrl,
                            parentid: parentid,
                            menuname: menuname,
                            isenable: isenable,
                            priority: priority
                        };
                    }
                    postdata.id = this.createMenuform.Mid || 0;
                    this.$getServerData('MenuMgr/AddorUpMenu', postdata, data => {
                        this.addMenuModal = false;
                        this.getProjectMenulist(this.defaultProject);
                        this.$Message.success('操作成功！');
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
        },
        selectMenu(sel) {
            this.selectMenulist = sel;
        },
        subselect(pid, row, type) {
            if (type == 'select') {
                this.subselectId[pid] = row;
            }
        },
        delMenu() {
            let menuname = [];
            this.subselectId.map(x => {
                x.map(k => {
                    menuname.push({
                        MenuName: k.MenuName,
                        Id: k.Id,
                        ParentID: k.ParentID
                    });
                });
            }
            ).join(',');

            if (menuname.length == 0 && this.selectMenulist.length == 0) {
                this.$Message.warning('请选择相应的菜单删除！');
                return;
            }

            var pidlist = this.selectMenulist.map(x => x.Id);

            this.$Modal.confirm({
                title: '确认是否删除以下菜单？',
                content: '<div style="font-size:14px;color:#F44336">' + this.selectMenulist.map(x => {
                    return ('<p>' + x.MenuName + '</p>') + menuname.filter(k => k.ParentID == x.Id).map(p => ('<p>&nbsp;&nbsp; ↳' + p.MenuName + '</p>')).join('');
                }
                ).join('') + '<p>-------</p>' + menuname.filter(k => pidlist.indexOf(k.ParentID) == -1).map(p => ('<p>&nbsp;&nbsp; ↳' + p.MenuName + '</p>')).join('') + '</div>',
                onOk: () => {
                    let idlist = menuname.map(x => x.Id).concat(pidlist);
                    this.$getServerData('MenuMgr/del', {
                        ids: idlist
                    }, data => {
                        this.getProjectMenulist(this.defaultProject);
                        this.$Message.success('操作成功！');
                    });
                },
            });
        },
        editProjectFun(type, tdata) {
            if (type == 'edit') {
                let _ProjectName = tdata.ProjectName;
                let _ProjectRemark = tdata.ProjectRemark;
                this.$Modal.confirm({
                    render: (h) => {
                        return h('div', [
                            h('div', [
                                h('p', {
                                    style: {
                                        margin: '5px 0'
                                    }
                                }, '项目名称：'),
                                h('Input', {
                                    props: {
                                        value: _ProjectName,
                                        placeholder: '请输入项目名称'
                                    },
                                    on: {
                                        input: (val) => {
                                            _ProjectName = val;
                                        }
                                    }
                                })
                            ]),
                            h('div', [
                                h('p', {
                                    style: {
                                        margin: '10px 0',
                                    }
                                }, '项目描述：'),
                                h('Input', {
                                    props: {
                                        value: _ProjectRemark,
                                        placeholder: '请输入项目名称'
                                    },
                                    on: {
                                        input: (val) => {
                                            _ProjectRemark = val;
                                        }
                                    }
                                })
                            ]),
                        ]);
                    },
                    onOk: () => {
                        if (!_ProjectName) {
                            this.$Message.warning('请录入完整信息');
                            return;
                        }
                        this.$getServerData('Project/addOrUpProject', {
                            id: tdata.Id,
                            projectname: _ProjectName,
                            projectremark: _ProjectRemark,
                            // projectkey: tdata.Projectkey
                        }, data => {
                            this.projectdata.filter(x => x.Id == tdata.Id)[0].ProjectName = _ProjectName;
                            this.projectdata.filter(x => x.Id == tdata.Id)[0].ProjectRemark = _ProjectRemark;
                            this.$Message.success('修改成功！');
                        });
                    },
                })
            }
            else {
                this.$Modal.confirm({
                    content: '<p>确定是否删除该项目？</p>',
                    onOk: () => {
                        this.$getServerData('Project/del', {
                            ids: [tdata.Id],
                        }, data => {
                            this.projectdata.splice(this.projectdata.findIndex(x => x.Id == tdata.Id), 1);
                            if (this.defaultProject == tdata.Id) {
                                this.defaultProject = this.projectdata[0].Id;
                                this.getProjectMenulist(this.projectdata[0].Id)
                            }
                            this.$Message.success('删除成功！');
                        });
                    },
                });
            }
        }
    }
}
</script>