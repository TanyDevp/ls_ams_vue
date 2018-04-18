<style>
.ivu-table-expanded-cell {
    background-color: #d8d8d8;
}
</style>
<template>
    <div>
        <Table size="small" border :columns="columns" :data="subdata" @on-selection-change="selectMenu" @on-select-cancel="cancelselectMenu">
        </Table>
        <Modal width="700" v-model="addBtnModal" title="按钮管理" :mask-closable="false" :closable="false" ok-text="保存">
            <Table ref="btnTable" id="btnTable" @on-current-change="selectBtn" size="small" height="200" :columns="btncolumns" :data="btndata" highlight-row></Table>
            <Form :model="btninfo" label-position="right" :label-width="100" style="marginTop:10px;">
                <Row>
                    <Col span="12">
                    <FormItem label="按钮名称：">
                        <Input v-model="btninfo.BtnName" placeholder="请输入按钮名称"></Input>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="按钮样式：">
                        <Input v-model="btninfo.BtnCss" placeholder="请输入按钮样式"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                    <FormItem label="是否启用：">
                        <Checkbox v-model="btninfo.IsEnable">
                        </Checkbox>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="优先级：">
                        <InputNumber v-model="btninfo.Priority" :editable="false"></InputNumber>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                    <FormItem label="当前状态:">
                        <h3 style="color:red">{{isEditBtn?'修改':'新增'}}</h3>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer" style="textAlign:center;">
                <Button @click="editbtn('cancel')">取消</Button>
                <Button @click="editbtn('del')">删除按钮</Button>
                <Button @click="editbtn('add')">新增按钮</Button>
                <Button type="primary" @click="savebtn()">保存按钮</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    props: {
        row: Object,
        editMenuModal: Function,
        subselect: Function
    },
    beforeMount() {
        this.getBtnlist(this.row.ChildNodes[0].Id);
    },
    created() {
        this.subdata = this.row.ChildNodes;
        if (this.row.ChildNodes.length > 0) {
            this.tid = this.row.ChildNodes[0].ParentID;
        }
    },
    data() {
        let _this = this;
        return {
            columns: [{
                type: 'selection',
                width: 60,
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
                title: '菜单名称',
                key: 'MenuName',
                align: 'center',
            },
            {
                title: '菜单地址',
                key: 'MenuUrl',
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
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    _this.editMenuModal(1, params.row)
                                }
                            }
                        }, '设置'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    _this.addBtnModal = true;
                                }
                            }
                        }, '按钮管理')
                    ])

                }
            }
            ],
            subdata: [],
            tid: 0,
            addBtnModal: false,
            btninfo: {
                id: 0,
                IsEnable: true,
                Priority: 1,
            },
            isEditBtn: false,
            btncolumns: [
                {
                    title: '序号',
                    key: 'rownum',
                    render: (h, params) => {
                        return h('strong', params.index + 1);
                    },
                    align: 'center',
                }, {
                    title: '按钮名称',
                    key: 'BtnName',
                    align: 'center'
                }, {
                    title: '按钮样式',
                    key: 'BtnCss',
                    align: 'center'
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
                    title: '优先级',
                    key: 'Priority',
                    align: 'center'
                }
            ],
            btndata: []

        }
    },
    methods: {
        selectMenu(sel) {
            if (sel.length > 0) {
                this.subselect(sel[0].ParentID, sel, 'select');
            }
            else {
                this.subselect(this.tid, [], 'select');
            }
        },
        cancelselectMenu(selection, row) {
            if (row.length > 0) {
                this.subselect(row[0].ParentID, selection, 'select');
            }
        },
        getBtnlist(menuid) {
            this.$getServerData('Button/getButtonlist', {
                menuid: menuid,
            }, data => {
                this.btndata = data.datalist;
            });
        },
        selectBtn(currentRow) {
            this.btninfo = currentRow;
            this.isEditBtn = true;
        },
        editbtn(type) {
            if (type == 'cancel') {
                this.addBtnModal = false;
            }
            else if (type == 'add') {
                this.$refs.btnTable.clearCurrentRow();
                this.isEditBtn = false;
                this.btninfo = {
                    Id: 0,
                    IsEnable: true,
                    Priority: 1,
                    MenuId: this.row.ChildNodes[0].Id
                };
            }
            else if (type == 'del') {
                if (this.btninfo.Id == 0) {
                    this.$Message.warning('请选择一项删除！');
                    return;
                }
                this.$Modal.confirm({
                    title: '确认是否删除该按钮？',
                    content: this.btninfo.BtnName,
                    onOk: () => {
                        this.$getServerData('Button/del', {
                            ids: [this.btninfo.Id],
                        }, data => {
                            this.getBtnlist(this.row.ChildNodes[0].Id);
                            this.$Message.success('删除成功！');
                        });
                    },
                });
            }
        },
        savebtn() {
            let postjson = {
                id: this.btninfo.Id,
                menuid: this.btninfo.MenuId,
                btnname: this.btninfo.BtnName,
                isenable: this.btninfo.IsEnable,
                btncss: this.btninfo.BtnCss,
                priority: this.btninfo.Priority
            };
            if (!postjson.btnname) {
                this.$Message.warning('请录入按钮信息');
                return;
            }
            this.$getServerData('Button/addOrUpButton', postjson, data => {
                this.getBtnlist(this.row.ChildNodes[0].Id);
                this.$Message.success('保存成功！');
            });
        }
    }
};
</script>

