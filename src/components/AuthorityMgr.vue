<style>
@-webkit-keyframes fadeIn {
    0% {
        background-color: #fff;
        width: 50%;
        /*初始状态 透明度为0*/
    }
    100% {
        background-color: #ddd;
        opacity: 1;
        width: 90%;
        /*结尾状态 透明度为1*/
    }
}

.editPowertitle {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    color: #ccc;
    margin: 0 auto;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
}

.roleBtnGroup {
    right: 10px;
    position: absolute;
    z-index: 1000;
}

.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #e2e2e2;
    color: #40a9ff;
    border-radius: 8px;
    width: 90%;
    -webkit-animation-name: fadeIn;
    /*动画名称*/
    -webkit-animation-duration: .2s;
    /*动画持续时间*/
    -webkit-animation-iteration-count: 1;
    /*动画次数*/
    -webkit-animation-delay: 0s;
    /*延迟时间*/
}
</style>

<template>
    <Row>
        <Col class="baseModal" span="6" justify="start">
        <div style="marginBottom:5px;">
            <Button style="float:left;" 　@click="editRole('add')">+</Button>
            <Input style="width:calc(100% - 39px)" placeholder="输入关键字进行过滤" />
        </div>
        <el-tree ref="Rolelist" :data="baseRolelist" :props="cascaderProps" :load="loadRoleMenu" node-key="Id" lazy :render-content="renderContent" @node-click="clickRole" highlight-current>
        </el-tree>
        </Col>
        <Col class="baseModal" span="18">
        <ButtonGroup class="roleBtnGroup">
            <Button @click="editRole('del')" :disabled="selectRole.Id==0">删除角色</Button>
            <Button @click="editRole('edit')" :disabled="selectRole.Id==0">修改信息</Button>
            <Button type="primary" @click="saveRole" :disabled="!isSubRole">保存修改</Button>
        </ButtonGroup>
        <template v-if="(selectRole.Id==0 || !isSubRole)">
            <h1 class="editPowertitle">权限控制区域</h1>
        </template>
        <template v-else>
            <Tabs value="name1" v-if="isSubRole">
                <TabPane label="权限管理" name="name1" icon="nuclear">
                    <Col span="12" style="border-right:1px solid #ccc;height:540px;">
                    <p>菜单权限</p>
                    <el-tree ref="menuAuthority" :data="baseMenulist" :props="MenuProps" node-key="BtnId" :render-content="renderMenuContent" show-checkbox></el-tree>
                    </Col>
                    <Col span="12">
                    <p>资源权限</p>
                    <el-tree ref="ResourceAuthority" :props="ResourceProps" :data="baseResourcelist" node-key="Id" :render-content="renderContent" show-checkbox> </el-tree>
                    </Col>
                </TabPane>
                <TabPane label="用户列表" name="name2" icon="person-add">
                    <Transfer :data="userlist" :target-keys="roleUserlist" :titles="['用户列表','已选用户']" :listStyle="{ width: '400px', height: '500px',textAlign:'left' }" :operations="[' <<取消','选中>>']" filterable @on-change="handleChange">
                    </Transfer>
                </TabPane>
            </Tabs>
        </template>
        </COl>

        <Modal v-model="addRoleModal" :title="isEditRole?'修改角色':'添加角色'" :loading="btnloading" @on-ok="saveEditRole" :mask-closable="false" :closable="false">
            <Form ref="formValidate_Role" :rules="ruleValidate" :model="selectRole" label-position="right" :label-width="100">
                <FormItem label="菜单类型：">
                    <RadioGroup v-model="selectRole.Ptype" type="button">
                        <Radio style="width:120px;text-align:center;" label="目录" :disabled="isEditRole && selectRole.Ptype=='角色'"></Radio>
                        <Radio style="width:120px;text-align:center;" label="角色" :disabled="isEditRole && selectRole.Ptype=='目录'"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="角色名称：" prop="RoleName">
                    <Input v-model="selectRole.RoleName" placeholder="请输入角色名称"></Input>
                </FormItem>
                <FormItem label="角色描述：" prop="RoleRemark">
                    <Input v-model="selectRole.RoleRemark" placeholder="请输入角色描述"></Input>
                </FormItem>
                <FormItem label="父级目录：" v-if="selectRole.Ptype=='角色'" prop="ParentID">
                    <Select v-model="selectRole.ParentID" filterable>
                        <Option v-for="item in baseRolelist" :value="item.Id.toString()" :key="item.Id">{{ item.RoleName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="是否启用：">
                    <Checkbox v-model="selectRole.IsEnable">
                    </Checkbox>
                </FormItem>
            </Form>
        </Modal>
    </Row>
</template>
<script>
import 'element-ui/lib/theme-chalk/index.css';
export default {
    beforeMount() {
        this.loadMenu();
        this.loadResource();
        this.loadUserlist();
    },
    data() {
        return {
            cascaderProps: { id: 'Id', value: 'Id', label: 'RoleName', children: 'children' },
            ResourceProps: { id: 'Id', value: 'Id', label: 'ResourceName', children: 'children' },
            MenuProps: { id: 'Id', value: 'Id', label: 'ProjectName', children: 'children' },
            selectRole: {
                Id: 0,
                Ptype: '角色',
                IsEnable: true
            },
            baseRolelist: [],
            baseResourcelist: [],
            baseMenulist: [],
            userlist: [],
            roleUserlist: [],
            btnloading: true,
            addRoleModal: false,
            isEditRole: false,
            isSubRole: false,
            ruleValidate: {
                RoleName: [
                    { required: true, message: '该内容不允许为空', trigger: 'blur' }
                ],
                RoleRemark: [
                    { required: true, message: '该内容不允许为空', trigger: 'blur' }
                ],
                ParentID: [
                    { required: true, message: '该内容不允许为空', trigger: 'change' }
                ],
            }
        }
    },
    methods: {
        getRoles(roleid, func) {
            this.$getServerData('RoleMgr/getRoles', {
                roleid: roleid
            }, data => {
                if (func) {
                    func(data.datalist);
                }
            });
        },

        getUser(roleid, func) {
            this.$getServerData('RoleMgr/getRoleUsers', {
                roleid: roleid
            }, data => {
                if (func) {
                    func(data.datalist);
                }
            });
        },

        getMenus(roleid, menuid, func) {
            if (menuid == 0) {
                this.$getServerData('RoleMgr/getFirstLevelMenu', {
                    roleid: roleid
                }, data => {
                    if (func) {
                        func(data.datalist);
                    }
                });
            }
            else if (menuid == 1) {

            }
        },

        getBtnAndResList(roleid) {
            this.$getServerData('RoleMgr/getPermissionBtnAndResList', {
                roleid: roleid
            }, data => {
                // this.defaultButtonCheck = data.Butlist;
                this.$refs.menuAuthority.setCheckedKeys(data.Butlist, true);
                this.$refs.ResourceAuthority.setCheckedKeys(data.Reslist, true);
                // this.defaultResourceCheck = data.Reslist;
            });
        },

        renderContent(h, { node, data, store }) {
            if (node.level == 1) {
                return (
                    <span class="custom-tree-node">
                        <i class="ivu-icon ivu-icon-person-stalker"></i>
                        &nbsp;&nbsp;
                    <span>{node.label}</span>
                    </span>);
            }
            else if (node.level > 1) {
                return (
                    <span class="custom-tree-node">
                        <i class="ivu-icon ivu-icon-person"></i>
                        &nbsp;&nbsp;
                    <span>{node.label}</span>
                    </span>);
            }
        },

        renderMenuContent(h, { node, data, store }) {
            if (node.level == 1) {
                return (
                    <span class="custom-tree-node">
                        <i class="ivu-icon ivu-icon-navicon"></i>
                        &nbsp;&nbsp;
                    <span>{node.label}</span>
                    </span>);
            }
            else if (node.level == 2) {
                return (
                    <span class="custom-tree-node">
                        <i class="ivu-icon ivu-icon-android-more-horizontal"></i>
                        &nbsp;&nbsp;
                    <span>{data.MenuName}</span>
                    </span>);
            }
            else if (node.level == 3) {
                return (
                    <span class="custom-tree-node">
                        <i class="ivu-icon ivu-icon-android-more-vertical"></i>
                        &nbsp;&nbsp;
                    <span>{data.MenuName}</span>
                    </span>);
            }
            else if (node.level == 4) {
                return (
                    <span class="custom-tree-node">
                        <i class="ivu-icon ivu-icon-android-radio-button-on"></i>
                        &nbsp;&nbsp;
                    <span>{data.MenuName}</span>
                    </span>);
            }
        },

        loadRoleMenu(node, resolve) {
            if (node.level === 0) {
                this.getRoles(0, data => {
                    this.baseRolelist = data;
                    return resolve(data);
                });
            }
            else if (node.level == 1) {
                this.getRoles(node.data.Id, data => {
                    return resolve(data);
                });
            }
            return resolve([]);
        },

        loadResource(node, resolve) {
            this.$getServerData('RoleMgr/getResource', {}, data => {
                this.baseResourcelist = data.datalist;
            });
        },

        loadMenu() {
            this.$getServerData('RoleMgr/getMenusTree', {}, data => {
                this.baseMenulist = data.datalist;
            });
        },

        loadUserlist() {
            this.$getServerData('User/getUserlist', {}, data => {
                if (data.datalist) {
                    data.datalist.map(x => {
                        x.key = x.Id;
                        x.label = x.UserName;
                    });
                    this.userlist = data.datalist;
                }
            });
        },

        handleChange(newTargetKeys) {
            this.roleUserlist = newTargetKeys;
        },

        clickRole(data, node, $el) {
            this.selectRole = JSON.parse(JSON.stringify(data));
            this.selectRole.Ptype = (data.Ptype == 1 || data.Ptype == '目录') ? '目录' : '角色';
            if (node.level < 2) {
                this.isSubRole = false;
                return;
            }
            this.isSubRole = true;
            this.getBtnAndResList(data.Id);
            this.getUser(data.Id, data => {
                this.roleUserlist = data.map(x => x.Id);
            });
        },

        saveRole() {
            let btnlist = this.$refs.menuAuthority.getCheckedKeys(true);
            let resoucelist = this.$refs.ResourceAuthority.getCheckedKeys(true);

            btnlist = btnlist.length > 0 ? btnlist : [0];
            resoucelist = resoucelist.length > 0 ? resoucelist : [0];
            this.$Modal.confirm({
                title: '确认是否保存修改？',
                onOk: () => {
                    this.$getServerData('RoleMgr/roleAddPemession', {
                        roleid: this.selectRole.Id,
                        resouceids: resoucelist,
                        btnidlist: btnlist
                    }, data => {
                        this.getBtnAndResList(this.selectRole.Id);
                        this.$Message.success('保存成功！');
                    });
                    this.$getServerData('RoleMgr/roleAddUser', {
                        roleid: this.selectRole.Id,
                        ids: this.roleUserlist,
                    }, data => {
                        this.getBtnAndResList(this.selectRole.Id);
                        this.$Message.success('保存成功！');
                    });
                },
            });
        },

        editRole(type) {
            if (type == 'add') {
                this.addRoleModal = true;
                this.isEditRole = false;
                this.selectRole = {
                    Id: 0,
                    Ptype: '角色',
                    IsEnable: true
                }
            }
            else if (type == 'edit') {
                this.addRoleModal = true;
                this.isEditRole = true;
                this.selectRole.ParentID = this.selectRole.ParentID.toString();
            }
            else if (type == 'del') {
                this.$Modal.confirm({
                    title: '确认是否删除该角色？',
                    content: this.selectRole.RoleName,
                    onOk: () => {
                        this.$getServerData('RoleMgr/del', {
                            ids: [this.selectRole.Id],
                        }, data => {
                            this.selectRole.Id = 0;
                            this.$refs.Rolelist.remove(this.selectRole);
                            this.$Message.success('删除成功！');
                        });
                    },
                });
            }
        },

        saveEditRole() {
            this.$refs.formValidate_Role.validate((valid) => {
                if (valid) {
                    let postjson = {
                        id: this.selectRole.Id,
                        ptype: this.selectRole.Ptype == '角色' ? 0 : 1,
                        rolename: this.selectRole.RoleName,
                        roleremark: this.selectRole.RoleRemark,
                        isenable: this.selectRole.IsEnable,
                    };
                    if (postjson.ptype == 0) {
                        postjson.parentid = this.selectRole.ParentID;
                    }
                    this.$getServerData('RoleMgr/addOrUpRole', postjson, data => {
                        this.selectRole.Id = 0;
                        this.addRoleModal = false;
                        this.getRoles(0, tdata => {
                            this.baseRolelist = tdata;
                        });
                        this.$Message.success('保存成功！');
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
        }
    }
}
</script>