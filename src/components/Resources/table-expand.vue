<style>
.ivu-table-expanded-cell {
    background-color: #d8d8d8;
}
</style>
<template>
    <div>
        <Table size="small" border :columns="columns" :data="subdata" @on-selection-change="selectResource" @on-select-cancel="cancelselectResource">
        </Table>
    </div>
</template>
<script>
export default {
    props: {
        row: Object,
        editFun: Function,
        subselect: Function
    },
    created() {
        this.subdata = this.row.children;
        if (this.row.children.length > 0) {
            this.tid = this.row.children[0].ParentID;
        }
    },
    data() {
        let _this = this;
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
                key: 'ResourceName',
                title: '资源名称',
                align: 'center',
            },
            {
                key: 'ResourceType',
                title: '资源类型',
                align: 'center',
            },
            {
                key: 'ResourceUrl',
                title: '资源地址',
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
                                this.editFun('edit', params.row)
                            }
                        }
                    }, '设置')
                }
            }
            ],
            subdata: [],
            tid: 0,
        }
    },
    methods: {
        selectResource(sel) {
            if (sel.length > 0) {
                this.subselect(sel[0].ParentID, sel, 'select');
            }
            else {
                this.subselect(this.tid, [], 'select');
            }
        },
        cancelselectResource(selection, row) {
            if (row.length > 0) {
                this.subselect(row[0].ParentID, selection, 'select');
            }
        },
    }
};
</script>

