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
        width: 100%;
        /*结尾状态 透明度为1*/
    }
}

.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #e2e2e2;
    color: #40a9ff;
    border-radius: 8px;
    -webkit-animation-name: fadeIn;
    /*动画名称*/
    -webkit-animation-duration: .2s;
    /*动画持续时间*/
    -webkit-animation-iteration-count: 1;
    /*动画次数*/
    -webkit-animation-delay: 0s;
    /*延迟时间*/
}

.userMain {
    text-align: left;
}

#dptcascader.el-cascader--small {
    width: 100%;
}

.el-cascader-menu__item {
    font-size: 12px;
    padding: 5px 10px;
    min-width: 120px;
}
</style>

<template>
    <Row>
        <Col class="baseModal" span="4">
        <Input placeholder="输入关键字进行过滤" v-model="filterText" />
        <el-tree ref="dptTree" :data="dptData" :render-content="renderContent" @node-click="selectDpt" highlight-current :props="cascaderProps" :filter-node-method="filterNode">
        </el-tree>
        </Col>
        <Col class="baseModal userMain" span="20" type="flex" justify="start">
        <ButtonGroup style="marginBottom:5px;">
            <Button type="primary" icon="plus-round" @click="userFunc('add')">新增用户</Button>
            <Button icon="wrench" @click="userFunc('edit')">修改用户</Button>
            <Button icon="close-round" @click="delUser">删除用户</Button>
            <Button type="primary" icon="plus-round" @click="dptFunc('add')">新增部门</Button>
            <Button icon="wrench" @click="dptFunc('edit')">修改部门</Button>
            <Button icon="close-round" @click="dptFunc('del')">删除部门</Button>
        </ButtonGroup>
        <Table ref="userTable" size="small" border :columns="columns" :data="userlist" @on-selection-change="selectUser" @on-select-cancel="selectUser">
        </Table>
        </Col>

        <Modal v-model="addUser" :title="useredit?'修改用户':'新增用户'" :loading="btnloading" @on-ok="saveUser" :mask-closable="false" :closable="false">
            <Form ref="formValidate_user" :rules="ruleValidate" :model="userData" label-position="right" :label-width="100">
                <FormItem label="用户名：" prop="username">
                    <Input v-model="userData.username" placeholder="请输入用户名：" :disabled="useredit"></Input>
                </FormItem>
                <FormItem label="密码：" prop="pwd">
                    <Input v-model="userData.pwd" placeholder="请输入密码" type="password"></Input>
                </FormItem>
                <FormItem label="真实姓名：" prop="realname">
                    <Input v-model="userData.realname" placeholder="请输入真实姓名"></Input>
                </FormItem>
                <FormItem label="部门：" prop="dptidtree">
                    <el-cascader id="dptcascader" size="small" :options="dptData" v-model="userData.dptidtree" change-on-select filterable :props="cascaderProps"></el-cascader>
                </FormItem>
                <Row>
                    <Col span="12">
                    <FormItem label="工号：" prop="jobno">
                        <Input v-model="userData.jobno" placeholder="请输入工号"></Input>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="职位：">
                        <Input v-model="userData.jobs" placeholder="请输入职位"></Input>
                    </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span="12">
                    <FormItem label="电话：">
                        <Input v-model="userData.phone" placeholder="请输入电话等联系方式"></Input>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="QQ：">
                        <Input v-model="userData.qq" placeholder="请输入QQ"></Input>
                    </FormItem>
                    </Col>
                </Row>

                <FormItem label="是否启用：">
                    <Checkbox v-model="userData.isenable">
                    </Checkbox>
                </FormItem>
            </Form>
        </Modal>

        <Modal v-model="addDpt" title="新增部门" :loading="btnloading" @on-ok="saveDpt" :mask-closable="false" :closable="false">
            <Form ref="formValidate_dpt" :rules="ruleValidate" :model="DptsetData" label-position="right" :label-width="100">
                <FormItem label="部门名称：" prop="dptname">
                    <Input v-model="DptsetData.dptname" placeholder="请输入部门名称："></Input>
                </FormItem>
                <FormItem label="父级部门：" prop="dpttreelist">
                    <el-cascader v-model="DptsetData.dpttreelist" id="dptcascader" size="small" :options="dptData" change-on-select filterable :props="cascaderProps"></el-cascader>
                </FormItem>
                <FormItem label="部门负责人：" prop="leaderid">
                    <Select v-model="DptsetData.leaderid" :label="DptsetData.leadername" @on-change="selectDptleader" label-in-value filterable clearable remote :remote-method="remoteMethod" :loading="loadingsearch">
                        <Option v-for="item in baseUserlist" :value="item.Id.toString()" :key="item.Id">{{item.UserName}}</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>

    </Row>
</template>
<script>
export default {
    watch: {
        filterText(val) {
            this.$refs.dptTree.filter(val);
        }
    },
    beforeMount() {
        this.getDptlist((data) => {
            this.getUserlist(data.Id)
        });
    },
    data() {
        return {
            columns: [{
                type: 'selection',
                width: '40px',
                align: 'center'
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
                key: 'JobNo',
                title: '工号',
                width: '100px',
                align: 'center',
            },
            {
                key: 'UserName',
                title: '用户名',
                align: 'center',
            },
            {
                key: 'RealName',
                title: '真实姓名',
                align: 'center',
                width: '100px',
            },
            {
                key: 'Jobs',
                title: '职位',
                align: 'center',
                width: '100px'
            },
            {
                key: 'QQ',
                title: 'QQ',
                align: 'center',
                width: '120px'
            },
            {
                key: 'Phone',
                title: '联系方式',
                align: 'center',
                width: '120px'
            },
            {
                key: 'IsEnable',
                title: '状态',
                width: '70px',
                render: (h, params) => {
                    return h('span', params.row.IsEnable && '启用' || '禁用');
                },
                align: 'center',
            },
            {
                key: 'IsSuperadmin',
                title: '超级管理员',
                render: (h, params) => {
                    return h('span', params.row.IsSuperadmin && '是' || '否');
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
            }
            ],
            filterText: '',
            dptData: [],
            dptselect: {},
            baseUserlist: [],
            userlist: [],
            selectuserlist: [],
            addUser: false,
            useredit: false,
            btnloading: true,
            loadingsearch: false,
            cascaderProps: { id: 'Id', value: 'Id', label: 'DptName', children: 'children' },
            userData: {
                id: 0,
                username: '',
                pwd: '',
                dptid: [],
                dptidtree: [1],
                isenable: true,
                realname: '',
                qq: '',
                phone: '',
                jobno: '',
                jobs: '',
            },
            addDpt: false,
            DptsetData: {
                id: 0,
                dptname: '',
                parentid: 0,
                parentname: '',
                dpttreelist: [],
                leaderid: 0,
                leadername: ''
            },
            ruleValidate: {
                username: [
                    { required: true, message: '该内容不允许为空', trigger: 'blur' }
                ],
                pwd: [
                    { required: true, message: '该内容不允许为空', trigger: 'blur' }
                ],
                realname: [
                    { required: true, message: '该内容不允许为空', trigger: 'blur' }
                ],
                jobno: [
                    { required: true, message: '该内容不允许为空', trigger: 'blur' }
                ],
                dptidtree: [
                    { required: true, type: 'array', message: '该内容不允许为空', trigger: 'change' }
                ],
                dptname: [
                    { required: true, message: '该内容不允许为空', trigger: 'blur' }
                ],
                leaderid: [
                    { required: true, message: '该内容不允许为空', trigger: 'change' }
                ],
                dpttreelist: [
                    { required: true, type: 'array', min: 1, message: '该内容不允许为空', trigger: 'change' }
                ],
            }
        }
    },
    methods: {
        getDptlist(func) {
            this.$getServerData('Department/getDptlist', {}, data => {
                this.dptData = data.datalist;
                if (func) {
                    if (data.datalist.length > 0) {
                        func(data.datalist[0]);
                    }
                }
            });
        },
        renderContent(h, { node, data, store }) {
            if (data.ParentId == 0) {
                return (
                    <div class="custom-tree-node">
                        <i class="ivu-icon ivu-icon-person-stalker"></i>
                        &nbsp;&nbsp;
                    <span>{data.DptName}</span>
                    </div>);
            }
            else {
                return (
                    <div class="custom-tree-node">
                        <i class="ivu-icon ivu-icon-person"></i>
                        &nbsp;&nbsp;
                    <span>{data.DptName}</span>
                    </div>);
            }
        },

        getUserlist(id, func) {
            this.$getServerData('User/getUserlist', {
                dptid: id
            }, data => {
                if (data.datalist) {
                    this.userlist = data.datalist;
                    // if (func) {
                    //     func(data.datalist);
                    // }
                }
            });
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.DptName.indexOf(value) !== -1;
        },
        selectDpt(tdata, Node, $el) {
            let dptselect = [];
            let tnode = Node;
            for (let i = Node.level - 1; i >= 0; i--) {
                dptselect[i] = tnode.data.Id;
                tnode = tnode.parent;
            }
            this.selectuserlist = [];
            this.userData.dptidtree = dptselect;
            this.dptselect = tdata;
            this.dptselect.dptTree = dptselect;
            this.getUserlist(tdata.Id);
        },
        userFunc(type) {
            this.btnloading = true;
            if (type == 'edit') {
                if (this.selectuserlist.length != 1) {
                    this.$Message.warning('仅支持修改一项。');
                    return;
                }
                let tdata = this.selectuserlist[0];
                this.userData = {
                    id: tdata.Id,
                    dptid: this.userData.dptid,
                    dptidtree: tdata.DptIdTree.split(',').map(x => Number(x)),
                    username: tdata.UserName,
                    pwd: tdata.Pwd,
                    isenable: tdata.IsEnable,
                    realname: tdata.RealName,
                    qq: tdata.QQ,
                    phone: tdata.Phone,
                    jobno: tdata.JobNo,
                    jobs: tdata.Jobs,
                };
                this.useredit = true;
                this.addUser = true;
                return;
            }
            else if (type == 'add') {
                this.userData = {
                    id: 0,
                    dptid: [],
                    dptidtree: this.userData.dptidtree,
                    username: '',
                    pwd: '',
                    isenable: true,
                    realname: '',
                    qq: '',
                    phone: '',
                    jobno: '',
                    jobs: '',
                };
                this.useredit = false;
                this.addUser = true;
                return;
            }
        },
        saveUser() {
            this.$refs.formValidate_user.validate((valid) => {
                if (valid) {
                    let postJson = JSON.parse(JSON.stringify(this.userData));
                    let dptid = postJson.dptidtree[postJson.dptidtree.length - 1];
                    postJson.dptid = dptid;
                    postJson.dptidtree = postJson.dptidtree.join(',');
                    this.$getServerData('User/addOrUpUserInfo', postJson, data => {
                        this.getUserlist(dptid);
                        this.addUser = false;
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
        selectUser(sel) {
            this.selectuserlist = sel;
        },
        delUser() {
            if (this.selectuserlist.length == 0) {
                this.$Message.warning('请选择需要删除的用户');
                return;
            }
            this.$Modal.confirm({
                title: '确认是否删除以下用户？',
                content: '<div style="font-size:14px;color:#F44336">' + (this.selectuserlist.map(x => {
                    return ('<p>' + x.UserName + '</p>');
                }).join('')) + '</div>',
                onOk: () => {
                    let useridlist = this.selectuserlist.map(x => x.Id);
                    let dptid = this.userData.dptidtree[this.userData.dptidtree.length - 1];
                    this.$getServerData('User/del', {
                        ids: useridlist
                    }, data => {
                        this.getUserlist(dptid);
                        this.$Message.success('操作成功！');
                    });
                },
            });
        },
        dptFunc(type) {
            if (type == 'del') {
                if (this.dptselect.Id == 0) {
                    this.$Message.warning('请选择需要删除的部门！');
                    return;
                }
                this.$Modal.confirm({
                    title: '确认是否删除以下部门？',
                    content: '<div style="font-size:14px;color:#F44336">' + this.dptselect.DptName + '</div>',
                    onOk: () => {
                        this.$getServerData('Department/del', {
                            ids: [this.dptselect.Id]
                        }, data => {
                            this.getDptlist();
                            this.$Message.success('操作成功！');
                        });
                    },
                });
            }
            else {
                this.btnloading = true;
                this.addDpt = true;
                if (type == 'add') {
                    this.DptsetData = {
                        id: 0,
                        dptname: '',
                        parentid: 0,
                        parentname: '',
                        dpttreelist: [1],
                        leaderid: 0,
                        leadername: ''
                    }
                }
                else if (type == 'edit') {
                    if (this.dptselect.id == 0) {
                        this.$Message.warning('请选择需要删除的部门！');
                        return;
                    }
                    let treelist = this.dptselect.dptTree.slice(0);
                    treelist.pop();
                    this.DptsetData = {
                        id: this.dptselect.Id,
                        dptname: this.dptselect.DptName,
                        parentid: this.dptselect.ParentId,
                        parentname: this.dptselect.ParentName,
                        dpttreelist: treelist,
                        leaderid: this.dptselect.LeaderId.toString(),
                        leadername: this.dptselect.LeaderName,
                    }
                }
            }
        },
        saveDpt() {
            this.$refs.formValidate_dpt.validate((valid) => {
                if (valid) {
                    let postJson = {
                        id: this.DptsetData.id,
                        dptname: this.DptsetData.dptname,
                        parentid: this.DptsetData.dpttreelist[this.DptsetData.dpttreelist.length - 1],
                        leaderid: this.DptsetData.leaderid,
                        leadername: this.DptsetData.leadername,
                    };
                    this.$getServerData('Department/addOrUpDpt', postJson, data => {
                        this.getDptlist();
                        this.addDpt = false;
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
        remoteMethod(input) {
            if (input.length < 1) {
                return;
            }
            this.$getServerData('User/getUserlist', {
                username: input
            }, data => {
                if (data.datalist) {
                    this.baseUserlist = data.datalist;
                }
            });
        },
        selectDptleader(option) {
            this.DptsetData.leaderid = option.value;
            this.DptsetData.leadername = option.label;
        }
    }
}
</script>